// Server actions de autenticación: login, logout, recuperar y restablecer contraseña.
"use server";

import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { z } from "zod";

type ActionResult = { error?: string };

export async function signIn(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: traducirAuthError(error.message) };

  redirect("/mi-cuenta");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

const emailSchema = z.string().email("Correo inválido");

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: "Correo inválido." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/restablecer`,
  });

  if (error) return { error: "No se pudo enviar el correo. Intentá de nuevo." };
  return {};
}

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número");

export async function updatePassword(password: string): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "No se pudo actualizar la contraseña. Intentá de nuevo." };

  redirect("/mi-cuenta");
}

function traducirAuthError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (msg.includes("Email not confirmed"))
    return "Debés verificar tu correo antes de ingresar. Revisá tu bandeja de entrada.";
  if (msg.includes("Too many requests")) return "Demasiados intentos. Esperá unos minutos.";
  return "No se pudo iniciar sesión. Intentá de nuevo.";
}
