-- =====================================================================
-- 0001_schema.sql
-- Esquema base del sistema de citas de Sandra.
-- Postgres / Supabase. Todo en UTC; la zona horaria de visualización
-- (America/Costa_Rica) vive en la tabla settings y en el frontend.
-- =====================================================================

-- Necesaria para el constraint que evita citas solapadas (rangos de tiempo).
create extension if not exists btree_gist;

-- ----------------------------- ENUMS --------------------------------
create type user_role            as enum ('client', 'admin');
create type appointment_status   as enum ('confirmed', 'completed', 'no_show', 'cancelled');
create type appointment_modality as enum ('online', 'in_person');

-- --------------------------- PROFILES -------------------------------
-- Extiende auth.users (que maneja Supabase Auth). Cada usuario registrado
-- tiene exactamente un profile. Sandra es el único 'admin'.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'client',
  full_name   text not null,
  phone       text,
  email       text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------- SERVICE TYPES ----------------------------
-- Los servicios que ofrece Sandra. Alimenta la página pública Y el booking.
create table public.service_types (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  duration_minutes int  not null default 50,
  price            numeric(10,2),
  is_active        boolean not null default true,
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ----------------------- AVAILABILITY RULES -------------------------
-- Disponibilidad recurrente semanal. Ej: lunes de 09:00 a 17:00.
-- Las horas son LOCALES (hora de Costa Rica), no timestamptz.
create table public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  day_of_week int  not null check (day_of_week between 0 and 6), -- 0 = domingo
  start_time  time not null,
  end_time    time not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  check (end_time > start_time)
);

-- --------------------------- DATE BLOCKS ----------------------------
-- Bloqueos puntuales: vacaciones, días libres, una mañana ocupada, etc.
create table public.date_blocks (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  reason     text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- -------------------------- APPOINTMENTS ----------------------------
create table public.appointments (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references public.profiles(id) on delete cascade,
  service_type_id     uuid references public.service_types(id) on delete set null,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  modality            appointment_modality not null default 'in_person',
  status              appointment_status   not null default 'confirmed',
  client_message      text,        -- nota opcional que el cliente escribe al reservar
  created_by          uuid references public.profiles(id), -- cliente o admin
  reminder_sent_at    timestamptz, -- usado por el cron de recordatorio 24h
  cancelled_at        timestamptz,
  cancellation_reason text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- Backstop a prueba de carreras (race conditions): dos citas NO canceladas
-- nunca pueden solaparse en el tiempo. Como solo atiende Sandra, una sola
-- regla global basta. Si dos personas reservan el mismo slot a la vez, una
-- de las dos transacciones falla aquí.
alter table public.appointments
  add constraint no_overlapping_appointments
  exclude using gist (tstzrange(starts_at, ends_at) with &&)
  where (status <> 'cancelled');

create index idx_appointments_client    on public.appointments(client_id);
create index idx_appointments_starts_at on public.appointments(starts_at);
create index idx_appointments_status    on public.appointments(status);

-- ---------------------- APPOINTMENT NOTES ---------------------------
-- Notas clínicas privadas de Sandra. EN TABLA SEPARADA a propósito:
-- así la política RLS es trivial ("solo admin") y un cliente jamás puede
-- leer estas notas, ni siquiera por accidente vía un select de la cita.
create table public.appointment_notes (
  appointment_id uuid primary key references public.appointments(id) on delete cascade,
  note           text,
  updated_at     timestamptz not null default now()
);

-- ----------------------------- SETTINGS -----------------------------
-- Configuración global del sitio (fila única). La controla Sandra.
create table public.settings (
  id                     int primary key default 1,
  accepting_new_patients boolean not null default true,
  whatsapp_number        text,
  contact_email          text,
  timezone               text not null default 'America/Costa_Rica',
  online_instructions    text default 'Sandra te enviará el enlace de la videollamada por WhatsApp uno o dos días antes de tu cita.',
  updated_at             timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1) on conflict do nothing;
