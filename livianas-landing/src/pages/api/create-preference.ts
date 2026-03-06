// src/pages/api/create-preference.ts
// Crea una preferencia de Checkout en MP con el email del comprador
// como external_reference para poder recuperarlo en el webhook.

import type { APIRoute } from 'astro';

const MP_ACCESS_TOKEN = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://livianas.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // La cuenta MP de Ana está en UYU (pesos uruguayos)
    // USD 15 ≈ UYU 650 — ajustar al tipo de cambio del momento
    const PRICE_UYU = 650;

    const preference = {
      items: [
        {
          id: 'pack-livianas-v1',
          title: 'Pack Livianas — Guía + Recetario Antiinflamatorio',
          description: 'Guía Livianas (32 pág) + Recetario +30 recetas (28 pág). Descarga inmediata.',
          quantity: 1,
          unit_price: PRICE_UYU,
          currency_id: 'UYU',
        },
      ],

      // El email viaja dentro del pago — resuelve el problema de localStorage
      external_reference: email,

      // URL de tu webhook — MP envía notificación cuando se aprueba el pago
      notification_url: `${SITE_URL}/api/webhook/mercadopago`,

      // A dónde vuelve el usuario después de pagar (Checkout Bricks lo maneja internamente,
      // pero es buena práctica configurarlo como fallback)
      back_urls: {
        success: `${SITE_URL}/materiales/gracias`,
        failure: `${SITE_URL}/materiales?status=failed`,
        pending: `${SITE_URL}/materiales/gracias?status=pending`,
      },
      auto_return: 'approved',

      // Expiración de la preferencia: 30 minutos
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),

      // Datos del pagador (pre-fill en el checkout)
      payer: {
        email: email,
      },

      // Metadata adicional
      metadata: {
        product: 'pack-livianas',
        source: 'checkout-bricks',
      },
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[create-preference] MP error:', data);
      return new Response(
        JSON.stringify({ error: 'Error al crear preferencia', detail: data }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        preference_id: data.id,
        init_point: data.init_point,    // URL de checkout (por si necesitás redirect de fallback)
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[create-preference] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
