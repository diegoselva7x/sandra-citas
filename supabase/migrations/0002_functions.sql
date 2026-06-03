-- =====================================================================
-- 0002_functions.sql
-- Triggers, helpers de seguridad y la lógica de negocio (RPCs).
-- Toda operación sensible del cliente pasa por estas funciones, no por
-- UPDATE/INSERT directo, para poder aplicar reglas de negocio.
-- =====================================================================

-- --------------------- trigger: updated_at --------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated      before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_service_types_updated before update on public.service_types
  for each row execute function public.set_updated_at();
create trigger trg_appointments_updated  before update on public.appointments
  for each row execute function public.set_updated_at();
create trigger trg_settings_updated      before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------- trigger: crear profile al registrarse un usuario --------
-- Cuando Supabase Auth crea un auth.users, creamos su profile en espejo.
-- El nombre y teléfono vienen del metadata que mandamos en el signUp.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    'client'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------ helper: ¿el usuario es admin? -------------------
-- SECURITY DEFINER => salta RLS al leer profiles, evitando recursión
-- cuando se usa dentro de las políticas RLS de otras tablas.
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ================== DISPONIBILIDAD (slots libres) ===================
-- Devuelve SOLO los horarios libres en un rango de fechas. Nunca expone
-- quién reservó qué: la página pública la puede llamar sin riesgo.
-- Cruza: reglas de disponibilidad - citas existentes - bloqueos - pasado.
create or replace function public.get_available_slots(
  p_from date,
  p_to   date,
  p_duration_minutes int default 50
)
returns table (slot_start timestamptz, slot_end timestamptz)
language plpgsql security definer stable set search_path = public as $$
declare
  v_tz text;
begin
  select timezone into v_tz from public.settings where id = 1;
  if v_tz is null then v_tz := 'America/Costa_Rica'; end if;

  return query
  with days as (
    select d::date as day, extract(dow from d)::int as dow
    from generate_series(p_from, p_to, interval '1 day') as d
  ),
  rules as (
    select dy.day, ar.start_time, ar.end_time
    from days dy
    join public.availability_rules ar
      on ar.day_of_week = dy.dow and ar.is_active
  ),
  -- genera slots candidatos partiendo del inicio de la ventana local,
  -- en pasos de p_duration_minutes. n=0..47 cubre hasta 24h de ventana.
  candidates as (
    select
      ((r.day + r.start_time) at time zone v_tz)
        + (n * make_interval(mins => p_duration_minutes)) as s_start,
      ((r.day + r.start_time) at time zone v_tz)
        + ((n + 1) * make_interval(mins => p_duration_minutes)) as s_end,
      ((r.day + r.end_time) at time zone v_tz) as window_end
    from rules r
    cross join generate_series(0, 47) as n
  )
  select c.s_start, c.s_end
  from candidates c
  where c.s_end <= c.window_end           -- el slot cabe dentro de la jornada
    and c.s_start > now()                 -- nada en el pasado
    and not exists (                      -- no choca con una cita activa
      select 1 from public.appointments a
      where a.status <> 'cancelled'
        and tstzrange(a.starts_at, a.ends_at) && tstzrange(c.s_start, c.s_end)
    )
    and not exists (                      -- no choca con un bloqueo
      select 1 from public.date_blocks b
      where tstzrange(b.starts_at, b.ends_at) && tstzrange(c.s_start, c.s_end)
    )
  order by c.s_start;
end;
$$;

-- ========================= RESERVAR CITA ============================
-- La llama el cliente autenticado. Valida: sesión, paciente nuevo vs
-- recurrente, slot dentro de disponibilidad y libre. El constraint de
-- solapamiento es el seguro final ante reservas simultáneas.
create or replace function public.book_appointment(
  p_starts_at      timestamptz,
  p_service_type_id uuid default null,
  p_modality       appointment_modality default 'in_person',
  p_client_message text default null
)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_uid       uuid := auth.uid();
  v_duration  int;
  v_ends_at   timestamptz;
  v_accepting boolean;
  v_tz        text;
  v_appt_id   uuid;
begin
  if v_uid is null then
    raise exception 'Debés iniciar sesión para reservar.';
  end if;

  if p_starts_at <= now() then
    raise exception 'No se puede reservar en el pasado.';
  end if;

  select timezone, accepting_new_patients into v_tz, v_accepting
  from public.settings where id = 1;

  -- Si Sandra cerró el cupo, solo bloquea a pacientes NUEVOS (sin citas previas).
  if not v_accepting and not exists (
    select 1 from public.appointments where client_id = v_uid
  ) then
    raise exception 'En este momento no se están aceptando pacientes nuevos.';
  end if;

  select duration_minutes into v_duration
  from public.service_types where id = p_service_type_id;
  if v_duration is null then v_duration := 50; end if;

  v_ends_at := p_starts_at + make_interval(mins => v_duration);

  -- El slot debe existir en la disponibilidad calculada (defensa amable).
  if not exists (
    select 1 from public.get_available_slots(
      (p_starts_at at time zone v_tz)::date,
      (p_starts_at at time zone v_tz)::date,
      v_duration
    ) s
    where s.slot_start = p_starts_at
  ) then
    raise exception 'Ese horario ya no está disponible.';
  end if;

  insert into public.appointments (
    client_id, service_type_id, starts_at, ends_at, modality,
    status, client_message, created_by
  ) values (
    v_uid, p_service_type_id, p_starts_at, v_ends_at, p_modality,
    'confirmed', p_client_message, v_uid
  )
  returning id into v_appt_id;

  return v_appt_id;
end;
$$;

-- ========================= CANCELAR CITA ============================
create or replace function public.cancel_appointment(
  p_appointment_id uuid,
  p_reason text default null
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_appt public.appointments;
begin
  if v_uid is null then raise exception 'No autenticado.'; end if;

  select * into v_appt from public.appointments where id = p_appointment_id;
  if v_appt.id is null then raise exception 'Cita no encontrada.'; end if;

  if v_appt.client_id <> v_uid and not public.is_admin() then
    raise exception 'No autorizado.';
  end if;

  if v_appt.status = 'cancelled' then return; end if;

  update public.appointments
    set status = 'cancelled', cancelled_at = now(), cancellation_reason = p_reason
    where id = p_appointment_id;
end;
$$;

-- ======================== REAGENDAR CITA ============================
create or replace function public.reschedule_appointment(
  p_appointment_id uuid,
  p_new_starts_at  timestamptz
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid      uuid := auth.uid();
  v_appt     public.appointments;
  v_duration int;
  v_new_end  timestamptz;
begin
  if v_uid is null then raise exception 'No autenticado.'; end if;

  select * into v_appt from public.appointments where id = p_appointment_id;
  if v_appt.id is null then raise exception 'Cita no encontrada.'; end if;

  if v_appt.client_id <> v_uid and not public.is_admin() then
    raise exception 'No autorizado.';
  end if;

  if p_new_starts_at <= now() then
    raise exception 'No se puede reagendar a una fecha pasada.';
  end if;

  v_duration := (extract(epoch from (v_appt.ends_at - v_appt.starts_at)) / 60)::int;
  v_new_end  := p_new_starts_at + make_interval(mins => v_duration);

  if exists (
    select 1 from public.appointments a
    where a.id <> p_appointment_id
      and a.status <> 'cancelled'
      and tstzrange(a.starts_at, a.ends_at) && tstzrange(p_new_starts_at, v_new_end)
  ) then
    raise exception 'Ese horario ya no está disponible.';
  end if;

  -- reminder_sent_at se reinicia para que el recordatorio salga a la nueva hora
  update public.appointments
    set starts_at = p_new_starts_at, ends_at = v_new_end, reminder_sent_at = null
    where id = p_appointment_id;
end;
$$;

-- --------------------------- permisos -------------------------------
grant execute on function public.get_available_slots(date, date, int) to anon, authenticated;
grant execute on function public.book_appointment(timestamptz, uuid, appointment_modality, text) to authenticated;
grant execute on function public.cancel_appointment(uuid, text) to authenticated;
grant execute on function public.reschedule_appointment(uuid, timestamptz) to authenticated;
