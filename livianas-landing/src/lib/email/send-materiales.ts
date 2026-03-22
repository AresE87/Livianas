// src/lib/email/send-materiales.ts — Email automático con materiales post-compra
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const GUIA_URL = import.meta.env.PUBLIC_GUIA_DOWNLOAD_URL || '';
const RECETARIO_URL = import.meta.env.PUBLIC_RECETARIO_DOWNLOAD_URL || '';
const FROM_EMAIL = import.meta.env.MATERIALES_FROM_EMAIL || 'LIVIANAS <hola@livianas.com>';

interface SendMaterialesOptions {
  to: string;
  nombre?: string;
}

export async function sendMaterialesEmail({ to, nombre }: SendMaterialesOptions) {
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
              <h1 style="margin:12px 0 0;font-size:24px;color:#ffffff;font-weight:700;">¡Tus materiales están listos!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;font-size:16px;color:#2C2825;line-height:1.6;">
                ${greeting}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#7A7470;line-height:1.6;">
                Gracias por tu compra. Acá tenés tus materiales del <strong style="color:#2C2825;">Pack Livianas</strong> listos para descargar.
              </p>

              <!-- Download: Guía -->
              ${GUIA_URL ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="background:#F0F3EC;border-radius:12px;padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#2C2825;">Guía Livianas</p>
                          <p style="margin:0 0 12px;font-size:12px;color:#A09A95;">PDF · 32 páginas</p>
                          <a href="${GUIA_URL}" style="display:inline-block;background:#7B8F6B;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:999px;font-size:14px;font-weight:700;">
                            Descargar Guía
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Download: Recetario -->
              ${RECETARIO_URL ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0F3EC;border-radius:12px;padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#2C2825;">Recetario Livianas</p>
                          <p style="margin:0 0 12px;font-size:12px;color:#A09A95;">PDF · 28 páginas</p>
                          <a href="${RECETARIO_URL}" style="display:inline-block;background:#7B8F6B;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:999px;font-size:14px;font-weight:700;">
                            Descargar Recetario
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Next steps -->
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#2C2825;">¿Qué sigue?</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">1.</strong> Descargá los PDFs en tu celular o compu
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">2.</strong> Empezá leyendo la Guía Livianas
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7470;line-height:1.5;">
                    <strong style="color:#5E7252;">3.</strong> Elegí una receta y preparala esta semana
                  </td>
                </tr>
              </table>

              <!-- Help -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF5F2;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#2C2825;">¿Tenés dudas sobre el contenido?</p>
                    <a href="https://wa.me/59891086674?text=${encodeURIComponent('Hola Ana! Acabo de comprar el Pack de Materiales 🌿')}" style="display:inline-block;background:#128C7E;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;">
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
                Recibís este email porque compraste el Pack de Materiales LIVIANAS.
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
    subject: '🌿 Tus materiales LIVIANAS están listos para descargar',
    html,
  });

  if (error) {
    console.error('[email] Error sending materiales email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[email] Materiales email sent to ${to}, id: ${data?.id}`);
  return data;
}

// Alias simplificado — usado por process-payment.ts y webhook/mercadopago.ts
export async function sendMateriales(email: string) {
  return sendMaterialesEmail({ to: email });
}

// ── Notificación a Ana cuando se concreta una venta ─────────────────
const ANA_EMAIL = 'anabienestarintegral25@gmail.com';

interface NotifyAnaOptions {
  buyerEmail: string;
  product: string;
  amount: number;
  currency: string;
}

export async function notifyAnaNewSale({ buyerEmail, product, amount, currency }: NotifyAnaOptions) {
  const now = new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:500px;margin:0 auto;padding:24px;color:#2d2d2d;">
  <h2 style="color:#7a8c6e;margin-bottom:4px;">🎉 ¡Nueva venta!</h2>
  <p style="color:#666;font-size:14px;margin-top:0;">${now}</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr>
      <td style="padding:8px 0;font-weight:600;color:#555;">Producto</td>
      <td style="padding:8px 0;">${product}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:600;color:#555;">Comprador</td>
      <td style="padding:8px 0;"><a href="mailto:${buyerEmail}" style="color:#7a8c6e;">${buyerEmail}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:600;color:#555;">Monto</td>
      <td style="padding:8px 0;">$${amount.toLocaleString('es-UY')} ${currency}</td>
    </tr>
  </table>
  <p style="font-size:13px;color:#999;">Los materiales ya fueron enviados automáticamente al comprador.</p>
</body>
</html>`.trim();

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ANA_EMAIL,
    subject: `🛒 Nueva venta: ${product} — ${buyerEmail}`,
    html,
  });

  if (error) {
    console.error('[email] Error notificando a Ana:', error);
    throw error;
  }

  console.log(`[email] Notificación de venta enviada a Ana (${buyerEmail})`);
}
