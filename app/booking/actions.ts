"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { cache } from "react";
import {
  bookAppointmentSchema,
  cancelSchema,
  rescheduleSchema,
  signUpSchema,
} from "@/lib/validations";
import type {
  ServiceType,
  Settings,
  AvailabilitySlot,
  AvailabilityRule,
} from "@/lib/types";
import {
  sendAppointmentConfirmation,
  sendWelcomeEmail,
  notifyAdminNewAppointment,
  sendCancellationEmail,
  sinBloquear,
} from "@/lib/email/send";

type ActionResult<T = unknown> = { data?: T; error?: string };

export async function signUp(input: unknown): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { fullName, email, phone, password } = parsed.data;
  const supabase = await createClient();

  // La confirmación por correo está desactivada en Supabase: signUp devuelve
  // sesión de una vez y el paciente entra directo a reservar. Un paso de
  // activación de más era la principal fuente de abandono.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // estos metadata los lee el trigger handle_new_user para crear el profile
      data: { full_name: fullName, phone },
    },
  });

  if (error) return { error: traducirAuthError(error.message) };

  await sinBloquear(
    sendWelcomeEmail({ to: email, name: fullName }),
    `bienvenida a ${email}`,
  );
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

  // Los correos no deben bloquear ni tumbar la reserva si fallan, pero el
  // fallo tiene que quedar registrado.
  await Promise.all([
    sinBloquear(
      sendAppointmentConfirmation({ appointmentId }),
      `confirmación de la cita ${appointmentId}`,
    ),
    sinBloquear(
      notifyAdminNewAppointment({ appointmentId }),
      `aviso a Sandra de la cita ${appointmentId}`,
    ),
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

  await sinBloquear(
    sendCancellationEmail({ appointmentId: parsed.data.appointmentId }),
    `cancelación de la cita ${parsed.data.appointmentId}`,
  );
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

  await sinBloquear(
    sendAppointmentConfirmation({
      appointmentId: parsed.data.appointmentId,
      rescheduled: true,
    }),
    `reagendado de la cita ${parsed.data.appointmentId}`,
  );
  return { data: { ok: true } };
}

// Funciones de solo lectura que alimentan la UI del flujo de reserva.

// Cliente anon sin cookies — válido para datos públicos
function anonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// `cache` de React deduplica dentro de un mismo render. Antes esto usaba
// unstable_cache con revalidate de una hora, que en Cloudflare exigiría montar
// el incremental cache de OpenNext (R2 + tag cache) para dos consultas triviales
// a Supabase. Las páginas que las usan son dinámicas, así que siempre leen fresco.
export const getActiveServices = cache(async (): Promise<ServiceType[]> => {
  const { data } = await anonClient()
    .from("service_types")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as ServiceType[]) ?? [];
});

/** Horario de atención publicado. Alimenta el openingHoursSpecification del JSON-LD. */
export const getPublicAvailability = cache(async (): Promise<AvailabilityRule[]> => {
  const { data } = await anonClient()
    .from("availability_rules")
    .select("day_of_week, start_time, end_time")
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time");
  return (data as AvailabilityRule[]) ?? [];
});

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

export const getBookingSettings = cache(async (): Promise<Settings | null> => {
  const { data } = await anonClient()
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data as Settings | null;
});

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
