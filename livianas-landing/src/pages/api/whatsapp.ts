// src/pages/api/whatsapp.ts — WhatsApp webhook (GET verify + POST messages)
import type { APIRoute } from 'astro';
import { chat } from '../../lib/chatbot/ai-client';
import { addMessage, getContextMessages, isSessionFull } from '../../lib/chatbot/sessions';
import { checkWhatsAppRate } from '../../lib/chatbot/rate-limiter';
import { checkEscalation } from '../../lib/chatbot/escalation';
import { sendWhatsAppMessage, markAsRead, parseWebhookMessage } from '../../lib/chatbot/whatsapp-api';
import { siteConfig } from '../../lib/config';

export const prerender = false;

// GET — Webhook verification (Meta sends a challenge)
export const GET: APIRoute = async ({ url }) => {
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const verifyToken = import.meta.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Verified successfully');
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
};

// POST — Incoming messages
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Meta sends status updates too — ignore non-message events
    const parsed = parseWebhookMessage(body);
    if (!parsed) {
      return new Response('OK', { status: 200 });
    }

    const { from, text, messageId } = parsed;

    // Mark as read immediately
    markAsRead(messageId).catch(() => {});

    // Rate limiting by phone
    if (!checkWhatsAppRate(from)) {
      await sendWhatsAppMessage(from, 'Estoy recibiendo muchos mensajes. Probá de nuevo en un minuto 🙏');
      return new Response('OK', { status: 200 });
    }

    // Use phone number as session ID for WhatsApp
    const sessionId = `wa:${from}`;

    // Check session limit
    if (isSessionFull(sessionId)) {
      await sendWhatsAppMessage(
        from,
        `Ya charlamos bastante 😊 Para seguir la conversación, escribile directamente a Ana: https://wa.me/${siteConfig.whatsappNumber}`
      );
      return new Response('OK', { status: 200 });
    }

    // Check escalation
    const escalation = checkEscalation(text);
    if (escalation.shouldEscalate) {
      let reply = '';
      if (escalation.reason === 'clinical') {
        reply = `Entiendo que estás pasando por un momento difícil. Esto merece atención personalizada. Te recomiendo hablar directamente con Ana 💚`;
      } else if (escalation.reason === 'payment_issue') {
        reply = `Para temas de pago, lo mejor es hablar directamente con Ana. Ella te ayuda personalmente.`;
      } else {
        reply = `¡Por supuesto! Le aviso a Ana para que te contacte. También podés escribirle directamente.`;
      }

      addMessage(sessionId, 'user', text);
      addMessage(sessionId, 'assistant', reply);
      await sendWhatsAppMessage(from, reply);
      return new Response('OK', { status: 200 });
    }

    // Normal flow: AI response
    addMessage(sessionId, 'user', text);
    const contextMessages = getContextMessages(sessionId);
    const reply = await chat(contextMessages);
    addMessage(sessionId, 'assistant', reply);

    await sendWhatsAppMessage(from, reply);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    // Always return 200 to Meta to avoid retries
    return new Response('OK', { status: 200 });
  }
};
