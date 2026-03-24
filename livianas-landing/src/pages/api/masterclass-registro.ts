// src/pages/api/masterclass-registro.ts — Registro para masterclass EFECTO LIVIANA
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM_EMAIL = import.meta.env.MATERIALES_FROM_EMAIL || 'LIVIANAS <hola@livianas.com>';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { nombre, email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[masterclass-registro] Registering: ${email} (${nombre})`);

    // Send confirmation email
    const greeting = nombre ? `¡Hola ${nombre}!` : '¡Hola!';
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FBF9F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF9F5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#2C2825;padding:32px 24px;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:0.25em;color:#C9A96E;font-weight:700;">EXPERIENCIA INTEGRAL CON ENERGÍA</p>
              <h1 style="margin:12px 0 0;font-size:28px;color:#FBF9F5;font-weight:700;font-family:Georgia,serif;">EFECTO LIVIANA</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(251,249,245,0.7);">Tu lugar está confirmado</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;font-size:16px;color:#2C2825;line-height:1.6;">
                ${greeting}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#7A7470;line-height:1.6;">
                Tu inscripción a la masterclass <strong style="color:#2C2825;">EFECTO LIVIANA</strong> está confirmada.
              </p>

              <!-- Event details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0F3EC;border-radius:12px;padding:20px;">
                    <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#2C2825;">Detalles del evento</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#7A7470;">📅 <strong style="color:#2C2825;">Sábado 28 de marzo de 2026</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#7A7470;">🕐 <strong style="color:#2C2825;">11:00 hs (Uruguay)</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#7A7470;">💻 <strong style="color:#2C2825;">Zoom</strong> — el link te llegará por email antes del evento</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#7A7470;">🎁 <strong style="color:#2C2825;">100% gratuita</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next steps -->
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#2C2825;">Próximos pasos:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#C9A96E;">1.</strong> Agendá la fecha en tu calendario
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#C9A96E;">2.</strong> Seguinos en Instagram: <a href="https://instagram.com/anabienestarintegral" style="color:#7B8F6B;font-weight:600;">@anabienestarintegral</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#C9A96E;">3.</strong> El link de Zoom te llegará por email antes del evento
                  </td>
                </tr>
              </table>

              <!-- Help -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#FDF5F2;border-radius:12px;padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#2C2825;">¿Tenés dudas?</p>
                    <a href="https://wa.me/59891086674?text=${encodeURIComponent('Hola Ana! Me inscribí a EFECTO LIVIANA 🌿')}" style="display:inline-block;background:#128C7E;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;">
                      Escribile a Ana por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;border-top:1px solid #E8DFD0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#A09A95;">
                © 2026 LIVIANAS. Todos los derechos reservados.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#A09A95;">
                Recibís este email porque te inscribiste a la masterclass EFECTO LIVIANA.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '✨ Tu lugar en EFECTO LIVIANA está confirmado',
      html,
    });

    if (error) {
      console.error('[masterclass-registro] Email error:', error);
      // Still return success — registration is the priority
    } else {
      console.log(`[masterclass-registro] Confirmation sent to ${email}, id: ${data?.id}`);
    }

    // Notify Ana
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: 'anabienestarintegral@gmail.com',
        subject: `Nueva inscripción: ${nombre || email} — EFECTO LIVIANA`,
        html: `<p><strong>${nombre || 'Sin nombre'}</strong> (${email}) se inscribió a la masterclass EFECTO LIVIANA.</p><p>Fecha: ${new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' })}</p>`,
      });
    } catch (e) {
      console.error('[masterclass-registro] Failed to notify Ana:', e);
    }

    return new Response(JSON.stringify({ status: 'success', email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[masterclass-registro] Error:', err);
    return new Response(JSON.stringify({ error: 'Error al registrar' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
