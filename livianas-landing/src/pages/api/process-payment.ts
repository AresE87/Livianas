// src/pages/api/process-payment.ts
// Recibe los datos del formulario de Checkout Bricks, crea el pago en MP,
// verifica que esté aprobado, deduplica con Supabase y envía el email.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendMateriales } from '../../lib/email/send-materiales';

const MP_ACCESS_TOKEN   = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;
const SUPABASE_URL      = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY      = import.meta.env.SUPABASE_SERVICE_ROLE_KEY; // service role — no la pública

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, ...paymentFormData } = body;

    if (!email) {
      return jsonResponse({ error: 'Email requerido' }, 400);
    }

    // ── 1. Crear el pago en MP usando los datos del Brick ─────────────────
    //    El Brick nos pasa el token de tarjeta, cuotas, método, etc.
    //    La cuenta MP de Ana está en UYU — USD 15 ≈ UYU 650
    const PRICE_UYU = 650;

    // ⚠️ SIEMPRE usar precio del servidor — nunca confiar en el amount del cliente
    const paymentPayload = {
      transaction_amount: PRICE_UYU,
      token:              paymentFormData.token,
      description:        'Pack Livianas — Guía + Recetario',
      installments:       paymentFormData.installments || 1,
      payment_method_id:  paymentFormData.payment_method_id,
      issuer_id:          paymentFormData.issuer_id,
      payer: {
        email: email,
        identification: paymentFormData.payer?.identification,
      },
      external_reference: email,
      metadata: {
        product: 'pack-livianas',
        source: 'checkout-bricks',
      },
    };

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `livianas-${email}-${Date.now()}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const payment = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('[process-payment] MP create error:', payment);
      return jsonResponse({
        status: 'error',
        message: 'No pudimos procesar el pago. Intentá de nuevo.',
      }, 500);
    }

    console.log(`[process-payment] Pago ${payment.id} → ${payment.status} (${email})`);

    // ── 2. Guardar en Supabase (siempre, sin importar el estado) ──────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    await supabase.from('purchases').upsert({
      payment_id:      String(payment.id),
      email:           email,
      status:          payment.status,
      amount:          payment.transaction_amount,
      currency:        payment.currency_id,
      payment_method:  payment.payment_method_id,
      email_sent:      false,
      created_at:      new Date().toISOString(),
    }, {
      onConflict: 'payment_id',
      ignoreDuplicates: false,
    });

    // ── 3. Solo enviar materiales si el pago fue APROBADO ─────────────────
    if (payment.status === 'approved') {

      // Deduplicación atómica: marcar email_sent=true SOLO si aún es false.
      // Esto evita race conditions entre process-payment y el webhook.
      const { data: claimed, error: claimErr } = await supabase
        .from('purchases')
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq('payment_id', String(payment.id))
        .eq('email_sent', false)
        .select('payment_id');

      if (claimErr) {
        console.error(`[process-payment] Error claiming pago ${payment.id}:`, claimErr);
      }

      if (!claimed || claimed.length === 0) {
        // Otro proceso ya lo marcó — no enviamos duplicado
        console.log(`[process-payment] Email ya enviado para pago ${payment.id} — skip`);
        return jsonResponse({ status: 'approved' }, 200);
      }

      // Enviar email con los materiales
      await sendMateriales(email);

      console.log(`[process-payment] ✅ Materiales enviados a ${email} (pago ${payment.id})`);
      return jsonResponse({ status: 'approved' }, 200);
    }

    // Pago pendiente (transferencia bancaria, etc.)
    if (payment.status === 'in_process' || payment.status === 'pending') {
      return jsonResponse({
        status: 'pending',
        message: 'Tu pago está siendo procesado. Te avisamos por email cuando se confirme.',
      }, 200);
    }

    // Pago rechazado
    const rejectionMessages: Record<string, string> = {
      cc_rejected_insufficient_amount:  'Fondos insuficientes en la tarjeta.',
      cc_rejected_bad_filled_card_number: 'Número de tarjeta incorrecto.',
      cc_rejected_bad_filled_date:       'Fecha de vencimiento incorrecta.',
      cc_rejected_bad_filled_security_code: 'Código de seguridad incorrecto.',
      cc_rejected_blacklist:             'La tarjeta no pudo ser procesada.',
      cc_rejected_call_for_authorize:    'Debés autorizar el cobro con tu banco.',
      cc_rejected_high_risk:             'El pago fue rechazado por seguridad.',
    };

    const userMessage = rejectionMessages[payment.status_detail]
      || 'El pago fue rechazado. Probá con otra tarjeta o medio de pago.';

    return jsonResponse({ status: 'rejected', message: userMessage }, 200);

  } catch (err) {
    console.error('[process-payment] Error:', err);
    return jsonResponse({ status: 'error', message: 'Error interno. Intentá de nuevo.' }, 500);
  }
};

function jsonResponse(data: object, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
