// src/pages/api/webhook/mercadopago.ts
// Webhook IPN de Mercado Pago — recibe notificaciones de pago.
// Actúa como canal principal para pagos pendientes (transferencias)
// y como backup para casos donde process-payment falló.
// Deduplicación vía Supabase: nunca envía el mismo email dos veces.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendMateriales } from '../../../lib/email/send-materiales';

const MP_ACCESS_TOKEN    = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;
const SUPABASE_URL       = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY       = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('[webhook-mp] Notificación recibida:', JSON.stringify(body));

    // MP puede enviar distintos tipos de notificaciones
    const { type, data, action } = body;

    // Solo procesamos notificaciones de pagos aprobados o actualizados
    const isPaymentNotification =
      type === 'payment' ||
      action === 'payment.updated' ||
      action === 'payment.created';

    if (!isPaymentNotification || !data?.id) {
      return new Response('ok', { status: 200 });
    }

    const paymentId = String(data.id);

    // ── 1. Obtener detalles del pago desde MP API ────────────────────────
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) {
      console.error(`[webhook-mp] No se pudo obtener pago ${paymentId}`);
      return new Response('error fetching payment', { status: 500 });
    }

    const payment = await mpRes.json();
    const { status, external_reference, transaction_amount, currency_id, payment_method_id } = payment;

    console.log(`[webhook-mp] Pago ${paymentId}: ${status} — ${external_reference}`);

    const email = external_reference;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.warn(`[webhook-mp] external_reference no es un email válido: "${email}"`);
      return new Response('no valid email in external_reference', { status: 200 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── 2. Guardar/actualizar en Supabase ───────────────────────────────
    await supabase.from('purchases').upsert({
      payment_id:   paymentId,
      email:        email,
      status:       status,
      amount:       transaction_amount,
      currency:     currency_id,
      payment_method: payment_method_id,
      updated_at:   new Date().toISOString(),
    }, {
      onConflict: 'payment_id',
      ignoreDuplicates: false,
    });

    // ── 3. Solo actuar si el pago está aprobado ─────────────────────────
    if (status !== 'approved') {
      return new Response('ok - not approved', { status: 200 });
    }

    // ── 4. Deduplicación: verificar si ya enviamos el email ──────────────
    const { data: purchase } = await supabase
      .from('purchases')
      .select('email_sent')
      .eq('payment_id', paymentId)
      .single();

    if (purchase?.email_sent) {
      console.log(`[webhook-mp] Email ya enviado para ${paymentId} — skip`);
      return new Response('ok - already sent', { status: 200 });
    }

    // ── 5. Enviar materiales ─────────────────────────────────────────────
    await sendMateriales(email);

    await supabase
      .from('purchases')
      .update({
        email_sent:    true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('payment_id', paymentId);

    console.log(`[webhook-mp] ✅ Materiales enviados a ${email} (pago ${paymentId})`);
    return new Response('ok', { status: 200 });

  } catch (err) {
    console.error('[webhook-mp] Error:', err);
    // Siempre responder 200 a MP para que no reintente indefinidamente
    // (si hay un error real, lo veremos en logs de Vercel)
    return new Response('error handled', { status: 200 });
  }
};

// MP también puede enviar GET para verificar el endpoint
export const GET: APIRoute = async () => {
  return new Response('Webhook activo', { status: 200 });
};
