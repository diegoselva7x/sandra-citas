# Backend de citas — Página web de Sandra

Base del sistema de reservas: base de datos, seguridad, auth, correos y el cron de recordatorios. Pensado para Next.js 15 (App Router) + Supabase + Resend, desplegado en Vercel.

## Estructura

```
sandra-citas/
├─ supabase/migrations/
│  ├─ 0001_schema.sql      Tablas, enums, constraint anti-solapamiento
│  ├─ 0002_functions.sql   Triggers, is_admin(), slots libres, RPCs (reservar/cancelar/reagendar)
│  ├─ 0003_rls.sql         Políticas Row Level Security en todas las tablas
│  └─ 0004_seed.sql        Datos de arranque (hacer admin a Sandra, horarios, servicios)
├─ lib/
│  ├─ supabase/
│  │  ├─ server.ts         Cliente para Server Components / Actions (respeta RLS)
│  │  ├─ client.ts         Cliente para el navegador
│  │  └─ admin.ts          Cliente service-role (SOLO servidor: crons, emails)
│  ├─ email/send.ts        Envío de correos con Resend (asuntos neutrales)
│  ├─ validations.ts       Esquemas Zod (front + back)
│  └─ types.ts             Tipos del dominio
├─ app/
│  ├─ booking/actions.ts   Server Actions: registro, reservar, cancelar, reagendar
│  └─ api/cron/reminders/  Cron de recordatorio 24h
├─ middleware.ts           Refresca sesión y protege /admin y /mi-cuenta
├─ vercel.json             Programación del cron
└─ .env.example            Variables de entorno
```

## Modelo de seguridad (lo importante)

1. **RLS en todas las tablas.** Aunque la app tuviera un bug, Postgres no deja
   que un cliente lea citas ajenas. Un cliente solo ve `appointments` donde
   `client_id = auth.uid()`.
2. **Notas clínicas aisladas.** Viven en `appointment_notes`, tabla con política
   "solo admin". Un cliente nunca las puede leer, ni por accidente.
3. **El cliente no escribe directo en `appointments`.** Reserva/cancela/reagenda
   vía funciones RPC (`book_appointment`, etc.) que aplican las reglas
   (slot libre, no en el pasado, cupo abierto). Solo Sandra (admin) inserta/edita directo.
4. **Anti doble-reserva real.** Un `EXCLUDE` constraint impide a nivel de DB que
   dos citas activas se solapen, incluso si dos personas reservan el mismo
   segundo. La validación de slot da el error amable; el constraint es el seguro.
5. **Service role solo en el servidor.** `lib/supabase/admin.ts` salta RLS y se usa
   únicamente en el cron y el envío de correos. Nunca se importa en el cliente.
6. **Cron protegido** con `CRON_SECRET` en el header Authorization.

## Puesta en marcha

1. Crear proyecto en Supabase y correr las migraciones en orden (SQL Editor o
   `supabase db push`). Dejar `0004_seed.sql` para después del paso 4.
2. Copiar `.env.example` a `.env.local` y llenar las llaves (Supabase, Resend, etc.).
3. Instalar deps:
   ```
   npm i @supabase/ssr @supabase/supabase-js resend date-fns date-fns-tz zod react-hook-form @hookform/resolvers
   ```
4. Que Sandra cree su cuenta por la web. Luego editar el correo en `0004_seed.sql`
   y correrlo para convertirla en admin + cargar horarios/servicios.
5. En Resend: verificar el dominio (registros SPF/DKIM/DMARC en el DNS) y ajustar
   el `FROM` en `lib/email/send.ts`. Sin esto, los correos caen en spam.
6. Deploy en Vercel. El cron de `vercel.json` arranca solo (requiere `CRON_SECRET`
   en las env vars del proyecto).

## Zona horaria

Todo se guarda en UTC. La visualización usa `America/Costa_Rica` (constante
`TIMEZONE` en `lib/types.ts` y la columna `timezone` en `settings`). Costa Rica
no tiene horario de verano, así que es estable.

## Pendiente de construir encima de esta base (UI)

- Páginas públicas (inicio, sobre mí, servicios, contacto) — esperan contenido de Sandra
- Flujo de reserva (selector de servicio → calendario de slots → confirmar)
- Auth UI (registro / login / recuperar contraseña)
- "Mi cuenta": ver/cancelar/reagendar mis citas
- Panel admin: lista + calendario, búsqueda de pacientes, crear cita manual,
  configurar disponibilidad, bloquear fechas, ficha de paciente, toggle de cupo

## Notas de producto ya incorporadas

- Asuntos de correo neutrales (no dicen "psicología") — privacidad en dispositivos compartidos.
- No-show: el correo al cliente es empático ("Te extrañamos…"), no acusatorio.
- Sin email de "completada".
- Modalidad online: la página avisa que Sandra manda el enlace por WhatsApp;
  no se gestiona el link de videollamada en el sistema.
