import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type"); // 'recovery' para reset de contraseña

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Si es un link de reset de contraseña, llevar al formulario de restablecer.
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/restablecer`);
      }
      return NextResponse.redirect(`${origin}/mi-cuenta`);
    }
  }

  // En caso de error, volver al inicio con un indicador.
  return NextResponse.redirect(`${origin}/?error=auth`);
}
