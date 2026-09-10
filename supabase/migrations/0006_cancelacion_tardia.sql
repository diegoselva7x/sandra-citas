-- =====================================================================
-- 0006_cancelacion_tardia.sql
--
-- Política de cancelación: el paciente sólo puede cancelar o reagendar
-- por su cuenta con al menos 12 horas de antelación. Dentro de esa
-- ventana debe coordinar con Sandra, y la cita queda marcada para cobro.
--
-- Sandra (admin) queda siempre exenta: ella maneja las excepciones.
--
-- Se aplica en las RPC porque RLS impide que el cliente haga UPDATE
-- directo sobre appointments: éste es el único punto que realmente
-- protege la regla. La UI sólo la refleja.
-- =====================================================================

-- Antelación mínima, en un solo lugar para no repetir el número.
create or replace function public.horas_minimas_cancelacion()
returns int language sql immutable as $$ select 12 $$;

-- Marca las cancelaciones que entraron dentro de la ventana, para que
-- Sandra sepa cuáles corresponde cobrar.
alter table public.appointments
  add column if not exists late_cancellation boolean not null default false;

comment on column public.appointments.late_cancellation is
  'Cancelada con menos de 12 h de antelación. Sandra decide si la cobra.';

-- ----------------------- CANCELAR CITA -------------------------------
create or replace function public.cancel_appointment(
  p_appointment_id uuid,
  p_reason text default null
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_appt   public.appointments;
  v_admin  boolean;
  v_horas  numeric;
  v_tardia boolean;
begin
  if v_uid is null then raise exception 'No autenticado.'; end if;

  select * into v_appt from public.appointments where id = p_appointment_id;
  if v_appt.id is null then raise exception 'Cita no encontrada.'; end if;

  v_admin := public.is_admin();

  if v_appt.client_id <> v_uid and not v_admin then
    raise exception 'No autorizado.';
  end if;

  if v_appt.status = 'cancelled' then return; end if;

  v_horas  := extract(epoch from (v_appt.starts_at - now())) / 3600;
  v_tardia := v_horas < public.horas_minimas_cancelacion();

  -- El paciente no puede cancelar solo dentro de la ventana; Sandra sí.
  if v_tardia and not v_admin then
    raise exception
      'Tu cita es en menos de % horas. Escribile a Sandra por WhatsApp para coordinar la cancelación.',
      public.horas_minimas_cancelacion()
      using errcode = 'P0001';
  end if;

  update public.appointments
    set status              = 'cancelled',
        cancelled_at        = now(),
        cancellation_reason = p_reason,
        -- Si la cancela Sandra dentro de la ventana, no se marca como cobrable:
        -- la excepción la está autorizando ella.
        late_cancellation   = (v_tardia and not v_admin)
    where id = p_appointment_id;
end;
$$;

-- ----------------------- REAGENDAR CITA ------------------------------
-- Sin el mismo límite, reagendar sería la puerta trasera para esquivar la
-- regla de cancelación: mover la cita a dentro de un mes equivale a
-- cancelarla. Además se validan date_blocks y availability_rules, que la
-- versión anterior ignoraba (a diferencia de book_appointment).
create or replace function public.reschedule_appointment(
  p_appointment_id uuid,
  p_new_starts_at  timestamptz
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid      uuid := auth.uid();
  v_appt     public.appointments;
  v_admin    boolean;
  v_duration int;
  v_new_end  timestamptz;
  v_horas    numeric;
begin
  if v_uid is null then raise exception 'No autenticado.'; end if;

  select * into v_appt from public.appointments where id = p_appointment_id;
  if v_appt.id is null then raise exception 'Cita no encontrada.'; end if;

  v_admin := public.is_admin();

  if v_appt.client_id <> v_uid and not v_admin then
    raise exception 'No autorizado.';
  end if;

  if p_new_starts_at <= now() then
    raise exception 'No se puede reagendar a una fecha pasada.';
  end if;

  v_horas := extract(epoch from (v_appt.starts_at - now())) / 3600;
  if v_horas < public.horas_minimas_cancelacion() and not v_admin then
    raise exception
      'Tu cita es en menos de % horas. Escribile a Sandra por WhatsApp para reagendarla.',
      public.horas_minimas_cancelacion()
      using errcode = 'P0001';
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

  -- Bloqueos de agenda (vacaciones, capacitaciones). Sandra puede pasar por encima.
  if not v_admin and exists (
    select 1 from public.date_blocks b
    where tstzrange(b.starts_at, b.ends_at) && tstzrange(p_new_starts_at, v_new_end)
  ) then
    raise exception 'Ese horario no está disponible.';
  end if;

  -- El horario nuevo tiene que caer dentro de la disponibilidad publicada.
  if not v_admin and not exists (
    select 1
    from public.availability_rules r,
         lateral (
           select (date_trunc('day', p_new_starts_at at time zone
                    coalesce((select timezone from public.settings where id = 1),
                             'America/Costa_Rica'))
                  )::date as d
         ) k
    where r.is_active
      and r.day_of_week = extract(dow from k.d)::int
      and (k.d + r.start_time) at time zone
            coalesce((select timezone from public.settings where id = 1),
                     'America/Costa_Rica') <= p_new_starts_at
      and (k.d + r.end_time) at time zone
            coalesce((select timezone from public.settings where id = 1),
                     'America/Costa_Rica') >= v_new_end
  ) then
    raise exception 'Ese horario está fuera del horario de atención.';
  end if;

  -- reminder_sent_at se reinicia para que el recordatorio salga a la nueva hora
  update public.appointments
    set starts_at = p_new_starts_at, ends_at = v_new_end, reminder_sent_at = null
    where id = p_appointment_id;
end;
$$;
