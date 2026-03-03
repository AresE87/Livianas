// src/lib/chatbot/rate-limiter.ts — Sliding window rate limiter

interface WindowEntry {
  timestamps: number[];
}

const WEB_LIMIT = 20;       // 20 requests per minute
const WHATSAPP_LIMIT = 10;  // 10 messages per minute
const WINDOW_MS = 60 * 1000; // 1 minute window

const webWindows = new Map<string, WindowEntry>();
const whatsappWindows = new Map<string, WindowEntry>();

function checkLimit(store: Map<string, WindowEntry>, key: string, limit: number): boolean {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= limit) {
    return false; // rate limited
  }

  entry.timestamps.push(now);
  return true; // allowed
}

export function checkWebRate(ip: string): boolean {
  return checkLimit(webWindows, ip, WEB_LIMIT);
}

export function checkWhatsAppRate(phone: string): boolean {
  return checkLimit(whatsappWindows, phone, WHATSAPP_LIMIT);
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of webWindows) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) webWindows.delete(key);
  }
  for (const [key, entry] of whatsappWindows) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) whatsappWindows.delete(key);
  }
}, 5 * 60 * 1000);
