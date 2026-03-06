// src/pages/api/webhook/mercadopago.ts — Webhook IPN de Mercado Pago
// Recibe notificaciones de pago y envía email automático con materiales
import type { APIRoute } from 'astro';
import { sendMaterialesEmail } from '../../../lib/email/send-materiales';

export const prerender = false;

const MP_ACCESS_TOKEN = import.meta.env.MERCADOPAGO_ACCESS_TOKEN || '';

// Mercado Pago envía POST con el payment ID
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    console.log('[webhook/mp] Received:', JSON.stringify(body));

    // Mercado Pago IPN v2 — notificación de pago
    // Tipos: "payment", "merchant_order", "chargebacks", etc.
    const topic = body.type || body.topic;
    const resourceId = body.data?.id || body.id;

    // Solo procesamos notificaciones de pago
    if (topic !== 'payment' && topic !== 'payment.created' && topic !== 'payment.updated') {
      console.log(`[webhook/mp] Ignoring topic: ${topic}`);
      return new Response(JSON.stringify({ status: 'ignored', topic }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!resourceId) {
      console.log('[webhook/mp] No resource ID found');
      return new Response(JSON.stringify({ error: 'No resource ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!MP_ACCESS_TOKEN) {
      console.error('[webhook/mp] MERCADOPAGO_ACCESS_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar pago con la API de Mercado Pago
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${resourceId}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
    });

    if (!paymentRes.ok) {
      console.error(`[webhook/mp] MP API error: ${paymentRes.status}`);
      return new Response(JSON.stringify({ error: 'MP API error', mp_status: paymentRes.status }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payment = await paymentRes.json();

    console.log(`[webhook/mp] Payment ${resourceId}: status=${payment.status}, email=${payment.payer?.email}`);

    // Solo enviamos email si el pago fue aprobado
    if (payment.status !== 'approved') {
      console.log(`[webhook/mp] Payment not approved (status: ${payment.status}), skipping email`);
      return new Response(JSON.stringify({ status: 'skipped', payment_status: payment.status }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extraer datos del comprador
    // Email viene de la preferencia (payer.email) o del external_reference como fallback
    const externalRefEmail = (payment.external_reference || '').startsWith('materiales_')
      ? payment.external_reference.replace('materiales_', '')
      : null;
    const payerEmail = payment.payer?.email || externalRefEmail;
    const payerName = payment.payer?.first_name || payment.additional_info?.payer?.first_name || '';

    if (!payerEmail) {
      console.error('[webhook/mp] No payer email found in payment data');
      return new Response(JSON.stringify({ error: 'No payer email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar que sea un pago del pack de materiales
    // Checkout Pro usa external_reference con formato "materiales_email@..."
    const description = (payment.description || '').toLowerCase();
    const extRef = (payment.external_reference || '').toLowerCase();
    const isMaterialesPurchase =
      extRef.startsWith('materiales_') ||
      description.includes('material') ||
      description.includes('pack') ||
      description.includes('livianas') ||
      // Fallback: si es el único producto activo, enviamos igual
      true;

    if (!isMaterialesPurchase) {
      console.log('[webhook/mp] Payment not for materiales, skipping');
      return new Response(JSON.stringify({ status: 'skipped', reason: 'not_materiales' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Enviar email con materiales
    await sendMaterialesEmail({
      to: payerEmail,
      nombre: payerName,
    });

    console.log(`[webhook/mp] ✅ Email sent to ${payerEmail} for payment ${resourceId}`);

    return new Response(JSON.stringify({
      status: 'success',
      email_sent_to: payerEmail,
      payment_id: resourceId,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[webhook/mp] Error:', err);
    // Siempre devolver 200 a MP para evitar reintentos infinitos en caso de error nuestro
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// MP también envía GET para verificar que el endpoint existe
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'ok', service: 'LIVIANAS materiales webhook' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
