"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import {
  bookAppointmentSchema,
  cancelSchema,
  rescheduleSchema,
  signUpSchema,
} from "@/lib/validations";
import type { ServiceType, Settings, AvailabilitySlot } from "@/lib/types";
import {
  sendAppointmentConfirmation,
  sendWelcomeEmail,
  notifyAdminNewAppointment,
  sendCancellationEmail,
} from "@/lib/email/send";

type ActionResult<T = unknown> = { data?: T; error?: string };

export async function signUp(input: unknown): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { fullName, email, phone, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // estos metadata los lee el trigger handle_new_user para crear el profile
      data: { full_name: fullName, phone },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: traducirAuthError(error.message) };

  // El correo de verificación lo manda Supabase. El de bienvenida es nuestro.
  await sendWelcomeEmail({ to: email, name: fullName }).catch(() => {});
  return { data: { ok: true } };
}

export async function bookAppointment(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = bookAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debés iniciar sesión para reservar." };

  const { data: appointmentId, error } = await supabase.rpc("book_appointment", {
    p_starts_at: parsed.data.startsAt,
    p_service_type_id: parsed.data.serviceTypeId ?? null,
    p_modality: parsed.data.modality,
    p_client_message: parsed.data.clientMessage ?? null,
  });

  if (error) return { error: error.message };

  // Los correos no deben bloquear ni tumbar la reserva si fallan.
  await Promise.allSettled([
    sendAppointmentConfirmation({ appointmentId }),
    notifyAdminNewAppointment({ appointmentId }),
  ]);

  return { data: { id: appointmentId as string } };
}

export async function cancelAppointment(input: unknown): Promise<ActionResult> {
  const parsed = cancelSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_appointment", {
    p_appointment_id: parsed.data.appointmentId,
    p_reason: parsed.data.reason ?? null,
  });
  if (error) return { error: error.message };

  await sendCancellationEmail({ appointmentId: parsed.data.appointmentId }).catch(() => {});
  return { data: { ok: true } };
}

export async function rescheduleAppointment(input: unknown): Promise<ActionResult> {
  const parsed = rescheduleSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.rpc("reschedule_appointment", {
    p_appointment_id: parsed.data.appointmentId,
    p_new_starts_at: parsed.data.newStartsAt,
  });
  if (error) return { error: error.message };

  await sendAppointmentConfirmation({
    appointmentId: parsed.data.appointmentId,
    rescheduled: true,
  }).catch(() => {});
  return { data: { ok: true } };
}

// Funciones de solo lectura que alimentan la UI del flujo de reserva.

// Cliente anon sin cookies — válido para datos públicos dentro de unstable_cache
function anonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const getActiveServices = unstable_cache(
  async (): Promise<ServiceType[]> => {
    const { data } = await anonClient()
      .from("service_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return (data as ServiceType[]) ?? [];
  },
  ["active-services"],
  { tags: ["services"], revalidate: 3600 },
);

export async function getAvailableSlots(
  from: string,
  to: string,
  durationMinutes: number,
): Promise<AvailabilitySlot[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_available_slots", {
    p_from: from,
    p_to: to,
    p_duration_minutes: durationMinutes,
  });
  return (data as AvailabilitySlot[]) ?? [];
}

export const getBookingSettings = unstable_cache(
  async (): Promise<Settings | null> => {
    const { data } = await anonClient()
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data as Settings | null;
  },
  ["booking-settings"],
  { tags: ["settings"], revalidate: 3600 },
);

export async function hasExistingAppointments(): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true });
  return (count ?? 0) > 0;
}

// Traduce los errores crudos de Supabase Auth a algo legible en español.
function traducirAuthError(msg: string): string {
  if (msg.includes("already registered")) return "Ese correo ya está registrado.";
  if (msg.includes("Password")) return "La contraseña no cumple los requisitos.";
  return "No se pudo completar el registro. Intentá de nuevo.";
}
