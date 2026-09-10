export type UserRole = "client" | "admin";
export type AppointmentStatus =
  | "confirmed"
  | "completed"
  | "no_show"
  | "cancelled";
export type AppointmentModality = "online" | "in_person";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  is_active: boolean;
  sort_order: number;
}

export interface Appointment {
  id: string;
  client_id: string;
  service_type_id: string | null;
  starts_at: string; // ISO UTC
  ends_at: string;
  modality: AppointmentModality;
  status: AppointmentStatus;
  client_message: string | null;
  created_by: string | null;
  reminder_sent_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  /** Cancelada con menos de 12 h de antelación: Sandra decide si la cobra. */
  late_cancellation: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityRule {
  day_of_week: number; // 0 = domingo … 6 = sábado
  start_time: string;  // "HH:MM:SS", hora local de Costa Rica
  end_time: string;
}

export interface AvailabilitySlot {
  slot_start: string;
  slot_end: string;
}

export interface Settings {
  id: number;
  accepting_new_patients: boolean;
  whatsapp_number: string | null;
  contact_email: string | null;
  timezone: string;
  online_instructions: string | null;
  instagram_url: string | null;
  address: string | null;
  maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const TIMEZONE = "America/Costa_Rica";
