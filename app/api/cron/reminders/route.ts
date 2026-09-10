import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendReminder } from "@/lib/email/send";

export const dynamic = "force-dynamic";

// Comparación resistente a timing attacks para validar el CRON_SECRET.
//
// Antes usaba timingSafeEqual y Buffer de Node. En Workers eso exige el shim de
// node:crypto; con TextEncoder no hace falta ningún compat flag y el resultado
// es el mismo. La diferencia de longitud se mezcla en el acumulador para no
// filtrarla por tiempo de retorno.
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);

  let diff = bufA.length ^ bufB.length;
  const largo = Math.max(bufA.length, bufB.length);
  for (let i = 0; i < largo; i++) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return diff === 0;
}

export async function GET(request: Request) {
  // Protección: el worker sandra-citas-cron envía 'Authorization: Bearer <CRON_SECRET>'.
  // Si CRON_SECRET no está configurado, rechazar siempre.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!safeEqual(auth, expected)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Ventana de 23–25h desde ahora. El cron corre cada hora (Cloudflare Cron
  // Trigger), así que ninguna cita se escapa. En Vercel el plan Hobby limitaba
  // a un disparo diario, y con esta ventana de 2 h casi ningún recordatorio
  // llegaba a salir.
  const from = new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString();
  const to = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();

  const { data: citas, error } = await getSupabaseAdmin()
    .from("appointments")
    .select(
      "id, starts_at, modality, profiles!appointments_client_id_fkey(full_name, email)",
    )
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .gte("starts_at", from)
    .lte("starts_at", to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let enviados = 0;
  const fallidos: string[] = [];

  for (const cita of citas ?? []) {
    try {
      // @ts-expect-error: la relación profiles llega como objeto
      await sendReminder(cita);
      // Sólo se marca después de un envío confirmado: si Resend rechaza, la
      // cita queda sin marcar y el próximo pase reintenta.
      await getSupabaseAdmin()
        .from("appointments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", cita.id);
      enviados++;
    } catch (e) {
      fallidos.push(cita.id);
      console.error(`Error enviando recordatorio de cita ${cita.id}:`, e);
    }
  }

  return NextResponse.json({
    procesadas: citas?.length ?? 0,
    enviados,
    fallidos,
  });
}
