"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { sendMissedYouEmail } from "@/lib/email/send";
import type { Profile, ServiceType, Settings } from "@/lib/types";

export interface AdminAppointment {
  id: string;
  starts_at: string;
  ends_at: string;
  modality: "online" | "in_person";
  status: "confirmed" | "completed" | "no_show" | "cancelled";
  client_message: string | null;
  cancellation_reason: string | null;
  created_at: string;
  service_type_id: string | null;
  client_id: string;
  service_types: { name: string; duration_minutes: number } | null;
  profiles: { full_name: string; email: string; phone: string | null } | null;
}

export interface PatientWithCount {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  appointment_count: number;
}

export async function getDashboardData() {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [todayResult, weekResult] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, starts_at, ends_at, modality, status, client_id, service_type_id, service_types(name, duration_minutes), profiles!appointments_client_id_fkey(full_name, email, phone)",
      )
      .gte("starts_at", todayStart.toISOString())
      .lte("starts_at", todayEnd.toISOString())
      .neq("status", "cancelled")
      .order("starts_at"),
    supabase
      .from("appointments")
      .select("id, status")
      .gte("starts_at", weekStart.toISOString())
      .lte("starts_at", weekEnd.toISOString()),
  ]);

  const todayCitas = (todayResult.data as unknown as AdminAppointment[]) ?? [];
  const weekCitas = weekResult.data ?? [];

  return {
    todayCitas,
    stats: {
      totalWeek: weekCitas.length,
      confirmedToday: todayCitas.filter((c) => c.status === "confirmed").length,
      completedWeek: weekCitas.filter((c) => c.status === "completed").length,
    },
  };
}

export async function getAppointmentsList(filters?: {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select(
      "id, starts_at, ends_at, modality, status, client_message, cancellation_reason, created_at, client_id, service_type_id, service_types(name, duration_minutes), profiles!appointments_client_id_fkey(full_name, email, phone)",
    )
    .order("starts_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.from) query = query.gte("starts_at", filters.from);
  if (filters?.to) query = query.lte("starts_at", filters.to);

  const { data } = await query.limit(100);
  let results = (data as unknown as AdminAppointment[]) ?? [];

  // Filtro por nombre/email del paciente (client-side, ya que Supabase no soporta ilike en relaciones)
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(
      (a) =>
        a.profiles?.full_name.toLowerCase().includes(s) ||
        a.profiles?.email.toLowerCase().includes(s),
    );
  }

  return results;
}

export async function getAppointmentNote(appointmentId: string): Promise<string> {
  if (!z.string().uuid().safeParse(appointmentId).success) return "";
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointment_notes")
    .select("note")
    .eq("appointment_id", appointmentId)
    .single();
  return (data as { note: string } | null)?.note ?? "";
}

const appointmentNoteSchema = z.object({
  appointmentId: z.string().uuid(),
  note: z.string().max(5000),
});

export async function saveAppointmentNote(
  appointmentId: string,
  note: string,
): Promise<{ error?: string }> {
  const parsed = appointmentNoteSchema.safeParse({ appointmentId, note });
  if (!parsed.success) return { error: "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointment_notes")
    .upsert(
      { appointment_id: parsed.data.appointmentId, note: parsed.data.note },
      { onConflict: "appointment_id" },
    );
  if (error) return { error: "No se pudo guardar la nota." };
  revalidatePath("/admin/citas");
  return {};
}

const validStatuses = ["confirmed", "completed", "no_show", "cancelled"] as const;

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(validStatuses),
  sendNoShowEmail: z.boolean().optional(),
});

export async function updateAppointmentStatus(
  id: string,
  status: (typeof validStatuses)[number],
  sendNoShowEmail = false,
): Promise<{ error?: string }> {
  const parsed = updateStatusSchema.safeParse({ id, status, sendNoShowEmail });
  if (!parsed.success) return { error: "Estado inválido." };

  const { id: safeId, status: safeStatus, sendNoShowEmail: safeNoShow } = parsed.data;

  const supabase = await createClient();
  const updateData: Record<string, unknown> = { status: safeStatus };
  if (safeStatus === "cancelled") {
    updateData.cancelled_at = new Date().toISOString();
  }

  const { error } = await supabase.from("appointments").update(updateData).eq("id", safeId);
  if (error) return { error: "No se pudo actualizar el estado." };

  if (safeStatus === "no_show" && safeNoShow) {
    await sendMissedYouEmail({ appointmentId: safeId }).catch(() => {});
  }

  revalidatePath("/admin/citas");
  revalidatePath("/admin");
  return {};
}

const manualAppointmentSchema = z.object({
  clientId: z.string().uuid(),
  serviceTypeId: z.string().uuid().optional(),
  startsAt: z.string().datetime({ offset: true }),
  modality: z.enum(["online", "in_person"]),
  clientMessage: z.string().max(500).optional(),
});

export async function createManualAppointment(
  input: unknown,
): Promise<{ error?: string; id?: string }> {
  const parsed = manualAppointmentSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const { clientId, serviceTypeId, startsAt, modality, clientMessage } = parsed.data;
  const supabase = await createClient();

  // Calcular ends_at según duración del servicio
  let durationMinutes = 50;
  if (serviceTypeId) {
    const { data: svc } = await supabase
      .from("service_types")
      .select("duration_minutes")
      .eq("id", serviceTypeId)
      .single();
    if (svc) durationMinutes = (svc as { duration_minutes: number }).duration_minutes;
  }

  const endsAt = new Date(new Date(startsAt).getTime() + durationMinutes * 60000).toISOString();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_id: clientId,
      service_type_id: serviceTypeId ?? null,
      starts_at: startsAt,
      ends_at: endsAt,
      modality,
      status: "confirmed",
      client_message: clientMessage ?? null,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: "No se pudo crear la cita. Verificá que el horario esté disponible." };
  revalidatePath("/admin/citas");
  revalidatePath("/admin");
  return { id: (data as { id: string }).id };
}

// Sanitiza el término de búsqueda: elimina caracteres que podrían
// interferir con la sintaxis de filtros de PostgREST (aunque el SDK ya
// usa parámetros, es una capa defensiva adicional).
function sanitizeSearch(raw: string): string {
  return raw
    .trim()
    .slice(0, 100) // longitud máxima
    .replace(/[%_\\]/g, "\\$&"); // escapar wildcards de LIKE
}

export async function getPatients(search?: string): Promise<PatientWithCount[]> {
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("id, full_name, email, phone, created_at")
    .eq("role", "client")
    .order("full_name");

  if (search?.trim()) {
    const safe = sanitizeSearch(search);
    query = query.or(
      `full_name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`,
    );
  }

  const { data: profiles } = await query.limit(50);
  if (!profiles) return [];

  // Contar citas por paciente
  const ids = profiles.map((p: { id: string }) => p.id);
  const { data: counts } = await supabase
    .from("appointments")
    .select("client_id")
    .in("client_id", ids);

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((c: { client_id: string }) => {
    countMap[c.client_id] = (countMap[c.client_id] ?? 0) + 1;
  });

  return (profiles as Profile[]).map((p) => ({
    ...p,
    appointment_count: countMap[p.id] ?? 0,
  }));
}

export async function getPatientDetail(patientId: string) {
  if (!z.string().uuid().safeParse(patientId).success) {
    return { profile: null, appointments: [] };
  }
  const supabase = await createClient();
  const [profileResult, appointmentsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", patientId).single(),
    supabase
      .from("appointments")
      .select(
        "id, starts_at, ends_at, modality, status, client_message, cancellation_reason, created_at, service_types(name, duration_minutes)",
      )
      .eq("client_id", patientId)
      .order("starts_at", { ascending: false }),
  ]);

  return {
    profile: profileResult.data as Profile | null,
    appointments: (appointmentsResult.data as unknown as AdminAppointment[]) ?? [],
  };
}

export async function getAdminSettings(): Promise<Settings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return data as Settings | null;
}

const settingsSchema = z.object({
  accepting_new_patients: z.boolean(),
  whatsapp_number: z.string().max(20).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  online_instructions: z.string().max(500).nullable().optional(),
});

export async function updateSettings(input: unknown): Promise<{ error?: string }> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("settings").update(parsed.data).eq("id", 1);
  if (error) return { error: "No se pudieron guardar los ajustes." };
  revalidatePath("/admin/configuracion");
  revalidateTag("settings", {});
  revalidatePath("/");
  revalidatePath("/contacto");
  return {};
}

const serviceTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().max(300).optional().nullable(),
  duration_minutes: z.number().int().min(10).max(240),
  price: z.number().min(0).nullable().optional(),
  sort_order: z.number().int().default(0),
});

export async function getAllServiceTypes(): Promise<ServiceType[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_types")
    .select("*")
    .order("sort_order");
  return (data as ServiceType[]) ?? [];
}

export async function upsertServiceType(input: unknown): Promise<{ error?: string }> {
  const parsed = serviceTypeSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  if (id) {
    const { error } = await supabase.from("service_types").update(rest).eq("id", id);
    if (error) return { error: "No se pudo actualizar el servicio." };
  } else {
    const { error } = await supabase.from("service_types").insert(rest);
    if (error) return { error: "No se pudo crear el servicio." };
  }
  revalidatePath("/admin/configuracion");
  revalidateTag("services", {});
  revalidatePath("/");
  revalidatePath("/servicios");
  return {};
}

export async function toggleServiceType(id: string, isActive: boolean): Promise<{ error?: string }> {
  const parsed = z.object({ id: z.string().uuid(), isActive: z.boolean() }).safeParse({ id, isActive });
  if (!parsed.success) return { error: "Datos inválidos." };
  const supabase = await createClient();
  const { error } = await supabase.from("service_types").update({ is_active: parsed.data.isActive }).eq("id", parsed.data.id);
  if (error) return { error: "No se pudo actualizar el servicio." };
  revalidatePath("/admin/configuracion");
  revalidateTag("services", {});
  revalidatePath("/");
  revalidatePath("/servicios");
  return {};
}

const availabilityRuleSchema = z.object({
  id: z.string().uuid().optional(),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
});

export async function getAvailabilityRules() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("availability_rules")
    .select("*")
    .eq("is_active", true)
    .order("day_of_week");
  return data ?? [];
}

export async function upsertAvailabilityRule(input: unknown): Promise<{ error?: string }> {
  const parsed = availabilityRuleSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  if (id) {
    const { error } = await supabase.from("availability_rules").update(rest).eq("id", id);
    if (error) return { error: "No se pudo actualizar la regla." };
  } else {
    const { error } = await supabase.from("availability_rules").insert({ ...rest, is_active: true });
    if (error) return { error: "No se pudo crear la regla." };
  }
  revalidatePath("/admin/configuracion");
  return {};
}

export async function deleteAvailabilityRule(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("availability_rules").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar la regla." };
  revalidatePath("/admin/configuracion");
  return {};
}

const dateBlockSchema = z.object({
  starts_at: z.string().datetime({ offset: true }),
  ends_at: z.string().datetime({ offset: true }),
  reason: z.string().max(200).optional().nullable(),
});

export async function getDateBlocks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("date_blocks")
    .select("*")
    .gte("ends_at", new Date().toISOString())
    .order("starts_at");
  return data ?? [];
}

export async function createDateBlock(input: unknown): Promise<{ error?: string }> {
  const parsed = dateBlockSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("date_blocks").insert(parsed.data);
  if (error) return { error: "No se pudo crear el bloqueo." };
  revalidatePath("/admin/configuracion");
  return {};
}

export async function deleteDateBlock(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("date_blocks").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar el bloqueo." };
  revalidatePath("/admin/configuracion");
  return {};
}
