// src/pages/api/send-materiales.ts — Endpoint para enviar materiales por email (llamado desde gracias page)
import type { APIRoute } from 'astro';
import { sendMaterialesEmail } from '../../lib/email/send-materiales';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, nombre } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[send-materiales] Sending materials to: ${email}`);

    await sendMaterialesEmail({ to: email, nombre: nombre || '' });

    console.log(`[send-materiales] ✅ Email sent to ${email}`);

    return new Response(JSON.stringify({ status: 'success', email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-materiales] Error:', err);
    return new Response(JSON.stringify({ error: 'Error al enviar email', message: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
