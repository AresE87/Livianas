// src/lib/chatbot/escalation.ts — Detecta cuándo escalar a Ana

const ESCALATION_KEYWORDS = [
  // Pedido explícito
  'hablar con ana',
  'quiero hablar con una persona',
  'quiero hablar con alguien',
  'contactar a ana',
  'escribirle a ana',
  'necesito hablar con ana',
  'pasame con ana',
  'persona real',
  'humano',

  // Temas clínicos sensibles
  'trastorno alimenticio',
  'trastorno alimentario',
  'anorexia',
  'bulimia',
  'autolesión',
  'autolesion',
  'suicidio',
  'suicida',
  'depresión',
  'depresion',
  'me quiero morir',
  'no quiero vivir',

  // Quejas o problemas de pago
  'no me funciona el pago',
  'problema con el pago',
  'me cobraron',
  'quiero reembolso',
  'devolución',
  'devolucion',
];

export interface EscalationResult {
  shouldEscalate: boolean;
  reason: 'explicit_request' | 'clinical' | 'payment_issue' | null;
}

export function checkEscalation(message: string): EscalationResult {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lowerOriginal = message.toLowerCase();

  for (const keyword of ESCALATION_KEYWORDS) {
    const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lower.includes(normalizedKeyword) || lowerOriginal.includes(keyword)) {
      // Classify the reason
      if (
        keyword.includes('ana') ||
        keyword.includes('persona') ||
        keyword.includes('humano') ||
        keyword.includes('alguien')
      ) {
        return { shouldEscalate: true, reason: 'explicit_request' };
      }
      if (
        keyword.includes('trastorno') ||
        keyword.includes('anorexia') ||
        keyword.includes('bulimia') ||
        keyword.includes('suicid') ||
        keyword.includes('autolesion') ||
        keyword.includes('depresion') ||
        keyword.includes('morir') ||
        keyword.includes('vivir')
      ) {
        return { shouldEscalate: true, reason: 'clinical' };
      }
      return { shouldEscalate: true, reason: 'payment_issue' };
    }
  }

  return { shouldEscalate: false, reason: null };
}
