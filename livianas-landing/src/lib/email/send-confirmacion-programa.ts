// src/lib/email/send-confirmacion-programa.ts — Email de confirmación de compra del Programa Livianas
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM_EMAIL = import.meta.env.MATERIALES_FROM_EMAIL || 'LIVIANAS <hola@livianas.com>';

interface SendConfirmacionOptions {
  to: string;
  nombre?: string;
}

export async function sendConfirmacionPrograma({ to, nombre }: SendConfirmacionOptions) {
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
            <td style="background:#7B8F6B;padding:32px 24px;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:0.25em;color:rgba(255,255,255,0.8);font-weight:700;">LIVIANAS</p>
              <h1 style="margin:12px 0 0;font-size:24px;color:#ffffff;font-weight:700;">¡Tu lugar está confirmado!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;font-size:16px;color:#2C2825;line-height:1.6;">
                ${greeting}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#7A7470;line-height:1.6;">
                Tu pago del <strong style="color:#2C2825;">Programa Livianas</strong> fue confirmado. Ya sos parte del grupo.
              </p>

              <!-- Programa info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0F3EC;border-radius:12px;padding:20px;">
                    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#2C2825;">Detalles del programa</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                          <strong style="color:#5E7252;">Duración:</strong> 4 semanas
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                          <strong style="color:#5E7252;">Clases en vivo:</strong> Sábados 11hs (Uruguay) por Zoom
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                          <strong style="color:#5E7252;">Grupo WhatsApp:</strong> Acompañamiento diario con Ana
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                          <strong style="color:#5E7252;">Grabaciones:</strong> Acceso de por vida
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next steps -->
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#2C2825;">¿Qué sigue?</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">1.</strong> Ana te va a escribir por WhatsApp para darte la bienvenida
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">2.</strong> Te sumamos al grupo privado de WhatsApp del programa
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">3.</strong> Recibís toda la info de la primera clase antes de empezar
                  </td>
                </tr>
              </table>

              <!-- Help -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF5F2;border-radius:12px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#2C2825;">¿Tenés alguna consulta?</p>
                    <a href="https://wa.me/59891086674?text=${encodeURIComponent('Hola Ana! Acabo de inscribirme en el Programa Livianas 🌿')}" style="display:inline-block;background:#128C7E;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;">
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
                Recibís este email porque te inscribiste en el Programa Livianas.
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
    to,
    subject: '🌿 ¡Tu lugar en el Programa Livianas está confirmado!',
    html,
  });

  if (error) {
    console.error('[email] Error sending confirmacion programa email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[email] Confirmacion programa email sent to ${to}, id: ${data?.id}`);
  return data;
}

export async function sendConfirmacionProgramaByEmail(email: string) {
  return sendConfirmacionPrograma({ to: email });
}
