// src/pages/api/chat.ts — POST endpoint para el widget web
import type { APIRoute } from 'astro';
import { chat } from '../../lib/chatbot/ai-client';
import { getSession, addMessage, getContextMessages, isSessionFull, getSessionMessageCount } from '../../lib/chatbot/sessions';
import { checkWebRate } from '../../lib/chatbot/rate-limiter';
import { checkEscalation } from '../../lib/chatbot/escalation';
import { siteConfig } from '../../lib/config';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkWebRate(ip)) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Esperá unos segundos.' }),
        { status: 429, headers }
      );
    }

    // Parse body
    const body = await request.json().catch(() => null);
    if (!body?.message || typeof body.message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Mensaje requerido' }),
        { status: 400, headers }
      );
    }

    const sessionId = body.sessionId || crypto.randomUUID();
    const userMessage = body.message.trim().slice(0, 1000); // Max 1000 chars

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Mensaje vacío' }),
        { status: 400, headers }
      );
    }

    // Check session limit
    if (isSessionFull(sessionId)) {
      const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}`;
      return new Response(
        JSON.stringify({
          reply: `Ya hablamos bastante 😊 Para seguir la conversación, escribile directamente a Ana: ${whatsappUrl}`,
          sessionId,
          escalated: false,
          sessionFull: true,
        }),
        { status: 200, headers }
      );
    }

    // Check escalation before AI call
    const escalation = checkEscalation(userMessage);
    if (escalation.shouldEscalate) {
      const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}`;
      let escalationReply = '';

      if (escalation.reason === 'clinical') {
        escalationReply = `Entiendo que estás pasando por un momento difícil. Esto es importante y merece atención personalizada. Te recomiendo hablar directamente con Ana: ${whatsappUrl} 💚`;
      } else if (escalation.reason === 'payment_issue') {
        escalationReply = `Para temas de pago, lo mejor es que hables directamente con Ana. Ella te puede ayudar personalmente: ${whatsappUrl}`;
      } else {
        escalationReply = `¡Por supuesto! Ana te puede ayudar personalmente. Escribile acá: ${whatsappUrl} 💚`;
      }

      addMessage(sessionId, 'user', userMessage);
      addMessage(sessionId, 'assistant', escalationReply);

      return new Response(
        JSON.stringify({
          reply: escalationReply,
          sessionId,
          escalated: true,
        }),
        { status: 200, headers }
      );
    }

    // Add user message and get context
    addMessage(sessionId, 'user', userMessage);
    const contextMessages = getContextMessages(sessionId);

    // Call Claude
    const reply = await chat(contextMessages);
    addMessage(sessionId, 'assistant', reply);

    return new Response(
      JSON.stringify({
        reply,
        sessionId,
        escalated: false,
        messageCount: getSessionMessageCount(sessionId),
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('[API /chat] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno. Intentá de nuevo.' }),
      { status: 500, headers }
    );
  }
};

// Handle preflight CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
