import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Punto de aterrizaje de los enlaces que manda Supabase por correo.
 *
 * Según el flujo, el enlace llega de dos formas distintas:
 *  - `?code=…`       flujo PKCE, se canjea con exchangeCodeForSession
 *  - `?token_hash=…` flujo clásico, se canjea con verifyOtp
 *
 * Antes solo se contemplaba `code`, así que un enlace del otro tipo caía al
 * error genérico. Ahora se aceptan los dos.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // 'recovery' para reset de contraseña

  // A dónde va después de establecer la sesión.
  const destino = type === "recovery" ? "/auth/restablecer" : "/mi-cuenta";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
    console.error("[auth] exchangeCodeForSession falló:", error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
    console.error("[auth] verifyOtp falló:", error.message);
  } else {
    console.error("[auth] callback sin code ni token_hash");
  }

  // El enlace venía vencido o ya usado. Se manda a pedir otro, no a la home:
  // caer en el inicio sin explicación es lo que hacía parecer que "no sirve".
  const destinoError =
    type === "recovery" ? "/auth/recuperar?error=enlace" : "/login?error=enlace";
  return NextResponse.redirect(`${origin}${destinoError}`);
}
