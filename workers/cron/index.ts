/**
 * Worker de recordatorios.
 *
 * Vercel disparaba el cron desde vercel.json; en Cloudflare eso no existe.
 * En vez de envolver el worker que genera OpenNext con un handler `scheduled`
 * —que obliga a tocar el bundle generado— este Worker aparte no hace más que
 * golpear el endpoint de la app con el CRON_SECRET. Es una pieza chica,
 * independiente y fácil de probar a mano.
 *
 * Corre cada hora. La ruta busca citas en una ventana de 23–25 h, así que con
 * pasadas horarias ninguna se escapa.
 */

interface Env {
  SITE_URL: string;
  CRON_SECRET: string;
}

async function dispararRecordatorios(env: Env): Promise<Response> {
  const url = `${env.SITE_URL.replace(/\/$/, "")}/api/cron/reminders`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
  });

  const cuerpo = await res.text();

  if (!res.ok) {
    console.error(`[cron] ${url} respondió ${res.status}: ${cuerpo}`);
  } else {
    console.info(`[cron] ${cuerpo}`);
  }

  return new Response(cuerpo, { status: res.status });
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(dispararRecordatorios(env));
  },

  // Disparo manual para verificar sin esperar a la hora en punto.
  // Protegido con el mismo secreto que el endpoint.
  async fetch(request: Request, env: Env): Promise<Response> {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    return dispararRecordatorios(env);
  },
};
