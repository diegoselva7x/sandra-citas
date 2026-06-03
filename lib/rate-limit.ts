// Para producción de alto volumen, reemplazar con Upstash Redis.

interface Window {
  timestamps: number[];
}

const store = new Map<string, Window>();

// Limpia entradas viejas cada N llamadas para evitar fugas de memoria.
let cleanupCounter = 0;
function maybeCleanup(windowMs: number) {
  if (++cleanupCounter % 500 !== 0) return;
  const cutoff = Date.now() - windowMs;
  for (const [key, win] of store) {
    if (win.timestamps.every((t) => t < cutoff)) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000,
): { allowed: boolean; remaining: number; resetMs: number } {
  maybeCleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;

  const win = store.get(key) ?? { timestamps: [] };
  // Eliminar timestamps fuera de la ventana
  win.timestamps = win.timestamps.filter((t) => t > cutoff);

  const remaining = Math.max(0, limit - win.timestamps.length);
  const oldest = win.timestamps[0] ?? now;
  const resetMs = oldest + windowMs - now;

  if (win.timestamps.length >= limit) {
    store.set(key, win);
    return { allowed: false, remaining: 0, resetMs };
  }

  win.timestamps.push(now);
  store.set(key, win);
  return { allowed: true, remaining: remaining - 1, resetMs };
}

// Límites predefinidos por acción
export const LIMITS = {
  signup:      { limit: 5,  windowMs: 15 * 60_000 },  // 5 registros / 15 min por IP
  login:       { limit: 10, windowMs: 10 * 60_000 },  // 10 intentos / 10 min por IP
  booking:     { limit: 8,  windowMs: 60 * 60_000 },  // 8 reservas / hora por IP
  contact:     { limit: 5,  windowMs: 60 * 60_000 },  // 5 envíos / hora por IP
  adminSearch: { limit: 60, windowMs: 60_000 },        // 60 búsquedas / min (solo admin)
} as const;
