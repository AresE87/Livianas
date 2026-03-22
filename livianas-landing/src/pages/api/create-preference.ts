// src/pages/api/create-preference.ts
// Crea una preferencia de Checkout en MP con el email del comprador
// como external_reference para poder recuperarlo en el webhook.

import type { APIRoute } from 'astro';

const MP_ACCESS_TOKEN = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;
const SITE_URL = 'https://livianas.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Precio en pesos uruguayos
    const PRICE_UYU = 990;

    // Normalizar SITE_URL (sin trailing slash)
    const siteUrl = SITE_URL.replace(/\/+$/, '');

    const preference = {
      items: [
        {
          id: 'pack-bienestar-v1',
          title: 'Pack Bienestar — Guía + Recetario Saludable',
          description: 'Guía de Bienestar Integral (47 pág) + Recetario Saludable (36 pág). +30 recetas en total. Descarga inmediata.',
          quantity: 1,
          unit_price: PRICE_UYU,
          currency_id: 'UYU',
        },
      ],

      external_reference: email,

      notification_url: `${siteUrl}/api/webhook/mercadopago`,

      back_urls: {
        success: `${siteUrl}/materiales/gracias`,
        failure: `${siteUrl}/materiales`,
        pending: `${siteUrl}/materiales/gracias`,
      },
      auto_return: 'approved',

      payer: {
        email: email,
      },

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
