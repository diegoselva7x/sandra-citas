-- =====================================================================
-- 0003_rls.sql
-- Row Level Security: la última línea de defensa. Aunque el código de la
-- app tuviera un bug, la base de datos no deja que un cliente lea o toque
-- lo que no es suyo. Se activa RLS en TODAS las tablas.
-- =====================================================================

alter table public.profiles           enable row level security;
alter table public.service_types      enable row level security;
alter table public.availability_rules enable row level security;
alter table public.date_blocks        enable row level security;
alter table public.appointments       enable row level security;
alter table public.appointment_notes  enable row level security;
alter table public.settings           enable row level security;

-- ---------------------------- PROFILES ------------------------------
create policy "leer propio perfil (o admin lee todos)"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- Un cliente puede editar su perfil pero NO ascenderse a admin (role debe seguir 'client').
create policy "actualizar propio perfil"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'client');

create policy "admin actualiza cualquier perfil"
  on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- ------------------------- SERVICE TYPES ----------------------------
-- El público (incluido anónimo) ve los servicios activos para la web.
create policy "público lee servicios activos"
  on public.service_types for select
  using (is_active or public.is_admin());

create policy "admin gestiona servicios"
  on public.service_types for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------- AVAILABILITY RULES -------------------------
create policy "público lee disponibilidad"
  on public.availability_rules for select using (true);

create policy "admin gestiona disponibilidad"
  on public.availability_rules for all
  using (public.is_admin()) with check (public.is_admin());

-- --------------------------- DATE BLOCKS ----------------------------
create policy "público lee bloqueos"
  on public.date_blocks for select using (true);

create policy "admin gestiona bloqueos"
  on public.date_blocks for all
  using (public.is_admin()) with check (public.is_admin());

-- -------------------------- APPOINTMENTS ----------------------------
-- Lectura: el cliente ve SOLO sus citas; Sandra ve todas.
create policy "cliente lee sus citas (admin ve todas)"
  on public.appointments for select
  using (client_id = auth.uid() or public.is_admin());

-- Inserción/edición directa: solo admin (Sandra agenda manualmente).
-- El cliente NO inserta ni actualiza directo: usa los RPC
-- book_appointment / cancel_appointment / reschedule_appointment,
-- que aplican las reglas de negocio.
create policy "admin crea citas"
  on public.appointments for insert
  with check (public.is_admin());

create policy "admin actualiza citas"
  on public.appointments for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admin elimina citas"
  on public.appointments for delete
  using (public.is_admin());

-- ---------------------- APPOINTMENT NOTES ---------------------------
-- Notas clínicas: exclusivamente admin. Ninguna política para clientes
-- => quedan completamente fuera de su alcance.
create policy "admin gestiona notas"
  on public.appointment_notes for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------- SETTINGS -----------------------------
create policy "público lee settings"
  on public.settings for select using (true);

create policy "admin actualiza settings"
  on public.settings for update
  using (public.is_admin()) with check (public.is_admin());
