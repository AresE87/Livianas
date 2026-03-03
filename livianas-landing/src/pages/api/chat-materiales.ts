// src/pages/api/chat-materiales.ts — POST endpoint para el chat de materiales
import type { APIRoute } from 'astro';
import { chatMateriales } from '../../lib/chatbot/ai-client-materiales';
import { getSession, addMessage, getContextMessages, isSessionFull, getSessionMessageCount } from '../../lib/chatbot/sessions';
import { checkWebRate } from '../../lib/chatbot/rate-limiter';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkWebRate(ip)) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Esperá unos segundos.' }),
        { status: 429, headers }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body?.message || typeof body.message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Mensaje requerido' }),
        { status: 400, headers }
      );
    }

    const sessionId = body.sessionId || crypto.randomUUID();
    const userMessage = body.message.trim().slice(0, 1000);

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Mensaje vacío' }),
        { status: 400, headers }
      );
    }

    // Session limit — no escalation to Ana, just friendly close
    if (isSessionFull(sessionId)) {
      return new Response(
        JSON.stringify({
          reply: 'Ya hablamos bastante 😊 Si querés comprar, usá el botón de pago en la página. ¡Éxitos!',
          sessionId,
          escalated: false,
          sessionFull: true,
        }),
        { status: 200, headers }
      );
    }

    // No escalation check — Livia materiales handles everything
    addMessage(sessionId, 'user', userMessage);
    const contextMessages = getContextMessages(sessionId);

    const reply = await chatMateriales(contextMessages);
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
    console.error('[API /chat-materiales] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno. Intentá de nuevo.' }),
      { status: 500, headers }
    );
  }
};

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
