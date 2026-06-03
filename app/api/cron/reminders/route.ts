import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendReminder } from "@/lib/email/send";

export const dynamic = "force-dynamic";

// Comparación resistente a timing attacks para validar el CRON_SECRET.
function safeEqual(a: string, b: string): boolean {
  // Rellenar al mismo largo para no filtrar info por diferencia de longitud
  const maxLen = Math.max(a.length, b.length);
  const bufA = Buffer.alloc(maxLen);
  const bufB = Buffer.alloc(maxLen);
  bufA.write(a);
  bufB.write(b);
  const equal = timingSafeEqual(bufA, bufB);
  // También verificar longitud exacta (no queremos que padding engañe)
  return equal && a.length === b.length;
}

export async function GET(request: Request) {
  // Protección: Vercel Cron envía 'Authorization: Bearer <CRON_SECRET>'.
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

  // Ventana de 23–25h desde ahora (el cron corre cada hora, así no se escapa ninguna).
  const from = new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString();
  const to = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();

  const { data: citas, error } = await supabaseAdmin
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
  for (const cita of citas ?? []) {
    try {
      // @ts-expect-error: la relación profiles llega como objeto
      await sendReminder(cita);
      await supabaseAdmin
        .from("appointments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", cita.id);
      enviados++;
    } catch (e) {
      console.error(`Error enviando recordatorio de cita ${cita.id}:`, e);
    }
  }

  return NextResponse.json({ procesadas: citas?.length ?? 0, enviados });
}
