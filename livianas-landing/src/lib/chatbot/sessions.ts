// src/lib/chatbot/sessions.ts — Manejo de sesiones en memoria con TTL

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Session {
  messages: Message[];
  createdAt: number;
  lastActivity: number;
}

const SESSION_TTL = 30 * 60 * 1000; // 30 minutos
const MAX_MESSAGES = 20;
const MAX_CONTEXT_MESSAGES = 10; // últimos 10 mensajes se envían a Claude

const sessions = new Map<string, Session>();

// Limpieza periódica cada 5 minutos
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions) {
      if (now - session.lastActivity > SESSION_TTL) {
        sessions.delete(id);
      }
    }
  }, 5 * 60 * 1000);
}

export function getSession(sessionId: string): Session {
  startCleanup();
  let session = sessions.get(sessionId);
  if (!session || Date.now() - session.lastActivity > SESSION_TTL) {
    session = { messages: [], createdAt: Date.now(), lastActivity: Date.now() };
    sessions.set(sessionId, session);
  }
  return session;
}

export function addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
  const session = getSession(sessionId);
  session.messages.push({ role, content });
  session.lastActivity = Date.now();
}

export function getContextMessages(sessionId: string): Message[] {
  const session = getSession(sessionId);
  return session.messages.slice(-MAX_CONTEXT_MESSAGES);
}

export function isSessionFull(sessionId: string): boolean {
  const session = getSession(sessionId);
  return session.messages.length >= MAX_MESSAGES;
}

export function getSessionMessageCount(sessionId: string): number {
  return getSession(sessionId).messages.length;
}
