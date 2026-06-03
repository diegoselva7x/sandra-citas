-- =====================================================================
-- 0004_seed.sql  (opcional — datos de arranque)
-- Corré esto DESPUÉS de que Sandra haya creado su cuenta por la web,
-- para convertirla en admin y dejar disponibilidad/servicios de ejemplo.
-- =====================================================================

-- 1) Convertir a Sandra en admin.
--    Reemplazá el correo por el real con el que ella se registró.
update public.profiles
set role = 'admin'
where email = 'sandra@ejemplo.com';

-- 2) Disponibilidad de ejemplo: lunes a viernes, 9:00–17:00 (hora CR).
insert into public.availability_rules (day_of_week, start_time, end_time) values
  (1, '09:00', '17:00'),  -- lunes
  (2, '09:00', '17:00'),  -- martes
  (3, '09:00', '17:00'),  -- miércoles
  (4, '09:00', '17:00'),  -- jueves
  (5, '09:00', '14:00');  -- viernes (media jornada)

-- 3) Servicios de ejemplo (Sandra los edita luego desde el panel).
insert into public.service_types (name, description, duration_minutes, price, sort_order) values
  ('Terapia individual', 'Sesión de acompañamiento psicológico personal.', 50, 25000, 1),
  ('Terapia de pareja',  'Sesión enfocada en la relación de pareja.',       60, 35000, 2),
  ('Terapia familiar',   'Sesión con el núcleo familiar.',                  60, 35000, 3),
  ('Primera consulta',   'Sesión inicial de valoración.',                   60, 25000, 0);

-- 4) Datos de contacto del sitio.
update public.settings
set whatsapp_number = '+506 0000 0000',
    contact_email   = 'sandra@ejemplo.com'
where id = 1;
