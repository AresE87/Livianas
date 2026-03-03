// src/lib/chatbot/whatsapp-api.ts — Helpers para WhatsApp Cloud API

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

function getConfig() {
  const phoneNumberId = import.meta.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = import.meta.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp API no configurada (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN)');
  }

  return { phoneNumberId, accessToken };
}

export async function sendWhatsAppMessage(to: string, text: string): Promise<boolean> {
  const { phoneNumberId, accessToken } = getConfig();

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[WhatsApp API] Send error:', response.status, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[WhatsApp API] Network error:', error);
    return false;
  }
}

export async function markAsRead(messageId: string): Promise<void> {
  const { phoneNumberId, accessToken } = getConfig();

  try {
    await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  } catch {
    // Non-critical, don't throw
  }
}

// Extract incoming message data from webhook payload
export function parseWebhookMessage(body: any): { from: string; text: string; messageId: string } | null {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== 'text') return null;

    return {
      from: message.from,
      text: message.text.body,
      messageId: message.id,
    };
  } catch {
    return null;
  }
}
