/**
 * Rate limiting por IP.
 *
 * Antes esto era un `Map` en el proceso. En Vercel ya era frágil (cada lambda
 * tenía el suyo), y en Cloudflare Workers directamente no limita nada: cada
 * isolate arranca con el Map vacío y se recicla constantemente. Con la
 * verificación por correo desactivada, el registro quedaría abierto a abuso.
 *
 * Ahora el estado vive en KV, que es compartido entre todos los isolates. KV es
 * de consistencia eventual, así que bajo un ataque muy paralelo pueden colarse
 * algunas peticiones de más; para frenar abuso desde una IP alcanza y sobra.
 *
 * Si KV no está disponible (desarrollo local con `next dev`), cae al Map en
 * memoria, que en un solo proceso sí funciona bien.
 */

interface Ventana {
  timestamps: number[];
}

export interface ResultadoLimite {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

// ---------------------------- respaldo local ----------------------------

const memoria = new Map<string, Ventana>();
let contadorLimpieza = 0;

function limpiarSiTocaa(windowMs: number) {
  if (++contadorLimpieza % 500 !== 0) return;
  const corte = Date.now() - windowMs;
  for (const [clave, v] of memoria) {
    if (v.timestamps.every((t) => t < corte)) memoria.delete(clave);
  }
}

function evaluar(previos: number[], limit: number, windowMs: number) {
  const ahora = Date.now();
  const corte = ahora - windowMs;
  const vigentes = previos.filter((t) => t > corte);

  const masViejo = vigentes[0] ?? ahora;
  const resetMs = masViejo + windowMs - ahora;

  if (vigentes.length >= limit) {
    return { allowed: false, remaining: 0, resetMs, timestamps: vigentes };
  }
  vigentes.push(ahora);
  return {
    allowed: true,
    remaining: Math.max(0, limit - vigentes.length),
    resetMs,
    timestamps: vigentes,
  };
}

// ------------------------------ KV ------------------------------

async function kvNamespace(): Promise<KVNamespace | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return ctx?.env?.RATE_LIMIT ?? null;
  } catch {
    // Fuera de Workers (next dev, tests) el módulo no resuelve el contexto.
    return null;
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000,
): Promise<ResultadoLimite> {
  const kv = await kvNamespace();

  if (!kv) {
    limpiarSiTocaa(windowMs);
    const previos = memoria.get(key)?.timestamps ?? [];
    const r = evaluar(previos, limit, windowMs);
    memoria.set(key, { timestamps: r.timestamps });
    return { allowed: r.allowed, remaining: r.remaining, resetMs: r.resetMs };
  }

  let previos: number[] = [];
  try {
    previos = (await kv.get<number[]>(key, "json")) ?? [];
  } catch {
    previos = [];
  }

  const r = evaluar(previos, limit, windowMs);

  try {
    await kv.put(key, JSON.stringify(r.timestamps), {
      // El TTL mínimo de KV es 60 s; todas nuestras ventanas son mayores.
      expirationTtl: Math.max(60, Math.ceil(windowMs / 1000)),
    });
  } catch {
    // Si KV falla no se bloquea al usuario: se prefiere dejar pasar antes que
    // dejar a alguien afuera por un problema de infraestructura.
  }

  return { allowed: r.allowed, remaining: r.remaining, resetMs: r.resetMs };
}

// Límites predefinidos por acción
export const LIMITS = {
  signup:      { limit: 5,  windowMs: 15 * 60_000 },  // 5 registros / 15 min por IP
  login:       { limit: 10, windowMs: 10 * 60_000 },  // 10 intentos / 10 min por IP
  booking:     { limit: 8,  windowMs: 60 * 60_000 },  // 8 reservas / hora por IP
  contact:     { limit: 5,  windowMs: 60 * 60_000 },  // 5 envíos / hora por IP
  adminSearch: { limit: 60, windowMs: 60_000 },        // 60 búsquedas / min (solo admin)
} as const;
