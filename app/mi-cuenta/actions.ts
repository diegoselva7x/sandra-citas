"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/lib/types";

export interface AppointmentWithService {
  id: string;
  starts_at: string;
  ends_at: string;
  modality: "online" | "in_person";
  status: "confirmed" | "completed" | "no_show" | "cancelled";
  client_message: string | null;
  cancellation_reason: string | null;
  service_type_id: string | null;
  service_types: { name: string; duration_minutes: number } | null;
}

export async function getMyAppointments(): Promise<AppointmentWithService[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("id, starts_at, ends_at, modality, status, client_message, cancellation_reason, service_type_id, service_types(name, duration_minutes)")
    .order("starts_at", { ascending: false });
  return ((data as unknown) as AppointmentWithService[]) ?? [];
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data as Profile | null;
}

export async function updateMyProfile(input: unknown): Promise<{ error?: string }> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone })
    .eq("id", user.id);

  if (error) return { error: "No se pudo actualizar el perfil. Intentá de nuevo." };

  revalidatePath("/mi-cuenta");
  return {};
}
