-- =====================================================================
-- 0005_contact_fields.sql
-- Agrega los datos de contacto del sitio a la tabla settings:
-- Instagram, dirección del consultorio y ubicación para el mapa.
-- Corré esto en el SQL editor de Supabase.
-- =====================================================================

alter table public.settings
  add column if not exists instagram_url text,
  add column if not exists address       text,
  add column if not exists maps_url       text,
  add column if not exists latitude       double precision,
  add column if not exists longitude      double precision;

-- Datos reales de Sandra. La dirección exacta en texto queda pendiente (address),
-- el mapa funciona con las coordenadas.
update public.settings set
  whatsapp_number = '+506 8922 9507',
  instagram_url   = 'https://www.instagram.com/psicologaclinica.sandra.carpio/',
  maps_url        = 'https://www.google.com/maps/place/9%C2%B051''40.6%22N+83%C2%B054''40.1%22W/@9.8607925,-83.9121244,18z/data=!4m4!3m3!8m2!3d9.8612814!4d-83.9111481?hl=es',
  latitude        = 9.8612814,
  longitude       = -83.9111481
where id = 1;
