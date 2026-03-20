// src/pages/api/send-confirmacion-programa.ts
// Envía email de confirmación del Programa Livianas al comprador.
// Llamado desde /programa-livianas/gracias vía visibilitychange (mismo patrón que materiales).

import type { APIRoute } from 'astro';
import { sendConfirmacionPrograma } from '../../lib/email/send-confirmacion-programa';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await sendConfirmacionPrograma({ to: email });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[send-confirmacion-programa] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
