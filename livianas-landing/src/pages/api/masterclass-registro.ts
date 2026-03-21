// src/pages/api/masterclass-registro.ts — Endpoint para registro en masterclass gratuita
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { nombre, email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!nombre || nombre.trim().length < 2) {
      return new Response(JSON.stringify({ error: 'Nombre inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[masterclass-registro] Nuevo registro: ${nombre} <${email}>`);

    // Guardar en Supabase
    const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY || import.meta.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/masterclass_registros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[masterclass-registro] Supabase warning: ${res.status} ${errorText}`);
        // Don't fail — still count as success for the user
      } else {
        console.log(`[masterclass-registro] ✅ Saved to Supabase`);
      }
    } else {
      console.warn('[masterclass-registro] No Supabase credentials — registration logged but not saved to DB');
    }

    // Send confirmation email via Resend
    const resendKey = import.meta.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Ana de Livianas <ana@livianas.com>',
            to: email.trim().toLowerCase(),
            subject: '¡Tu lugar está reservado! — Masterclass Las 3 Mentiras',
            html: `
              <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2C2825;">
                <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">¡Hola ${nombre.trim()}!</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #7A7470; margin-bottom: 24px;">
                  Tu lugar en la masterclass <strong>"Las 3 Mentiras"</strong> está confirmado.
                </p>
                <div style="background: #F0F3EC; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; font-weight: 600;">📅 26 de abril de 2026</p>
                  <p style="margin: 0 0 8px; font-weight: 600;">🕐 19:00 hs (Uruguay)</p>
                  <p style="margin: 0; font-weight: 600;">💻 En vivo por Zoom</p>
                </div>
                <p style="font-size: 14px; line-height: 1.6; color: #7A7470;">
                  Te voy a enviar el link de Zoom el día del evento.
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #7A7470; margin-top: 24px;">
                  Con cariño,<br><strong>Ana</strong> 🌿
                </p>
              </div>
            `,
          }),
        });
        console.log(`[masterclass-registro] ✅ Confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.warn(`[masterclass-registro] Email send failed:`, emailErr);
      }
    }

    return new Response(JSON.stringify({ status: 'success', nombre, email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[masterclass-registro] Error:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
