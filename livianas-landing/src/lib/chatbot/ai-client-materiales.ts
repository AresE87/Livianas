// src/lib/chatbot/ai-client-materiales.ts — Claude API wrapper for /materiales
import Anthropic from '@anthropic-ai/sdk';
import { buildMaterialesPrompt } from './system-prompt-materiales';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY no configurada');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatMateriales(messages: Message[]): Promise<string> {
  const anthropic = getClient();
  const systemPrompt = buildMaterialesPrompt();

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock?.text ?? 'Lo siento, no pude generar una respuesta. Probá de nuevo.';
  } catch (error: unknown) {
    console.error('[AI Client Materiales] Error:', error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return 'Estoy recibiendo muchas consultas ahora mismo. Probá de nuevo en unos segundos.';
      }
      if (error.status === 401) {
        console.error('[AI Client Materiales] API key inválida');
        return 'Hay un problema técnico. Intentá de nuevo en unos minutos.';
      }
    }

    return 'Algo salió mal. Intentá de nuevo en unos segundos.';
  }
}
