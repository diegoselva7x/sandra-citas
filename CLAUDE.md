# Proyecto: Página web de Sandra (psicóloga)

## Qué es
Sitio web profesional para **Sandra**, psicóloga en Costa Rica. Incluye páginas
públicas (servicios, sobre ella, contacto, contenido educativo), **sistema de
reservas de citas en línea**, y un **panel de administración** para que ella
gestione su agenda y edite contenido. Lo desarrolla el dueño del repo (ing.
fullstack).

## Estado actual — Demo live en https://sandra-citas.vercel.app · Pendiente: contenido de Sandra + setup inicial DB

### ✅ Fase 0 — Entorno
Node v22 + Next.js 16 + Supabase (`sandra-web`, West US Oregon) + shadcn/ui.
Migraciones 0001-0003 aplicadas. `.env.local` configurado.

### ✅ Fase 1 — Auth UI
- `app/auth/actions.ts` — signIn, signOut, requestPasswordReset, updatePassword
- `app/auth/callback/route.ts` — `/auth/callback`
- `app/(auth)/` — registro, login, recuperar, restablecer
- `components/header.tsx` — estado de sesión (server component)

### ✅ Fase 2 — Flujo de reserva
- `app/booking/actions.ts` — getActiveServices, getAvailableSlots, getBookingSettings, hasExistingAppointments
- `components/booking/` — wizard 4 pasos (servicio → modalidad → horario → confirmar) + pantalla éxito
- `app/reservar/page.tsx`

### ✅ Fase 3 — Mi cuenta
- `app/mi-cuenta/actions.ts` + `app/mi-cuenta/page.tsx`
- `components/account/` — cancel-dialog, reschedule-dialog, appointment-card, profile-form, account-tabs

### ✅ Fase 4 — Panel admin
- `app/admin/actions.ts` — todas las acciones (dashboard, citas, pacientes, config)
- `app/admin/layout.tsx` — sidebar desktop + nav bottom mobile
- `app/admin/{page,citas,pacientes,configuracion}/` — todas las vistas
- `components/admin/` — status-menu, appointment-note, detail-dialog, manual-dialog, calendar

### ✅ Fase 5 — Páginas públicas
- `app/page.tsx` — inicio (hero, servicios desde DB, modalidades, CTA)
- `app/sobre-mi/page.tsx` — bio con placeholders TODO
- `app/servicios/page.tsx` — servicios dinámicos desde DB
- `app/recursos/page.tsx` — 5 secciones educativas con placeholders
- `app/contacto/page.tsx` + `contact-form.tsx` — formulario mailto + datos de settings
- `components/header.tsx` — nav pública completa
- `components/mobile-nav.tsx` — hamburger con Sheet
- `components/footer.tsx` — nav, WhatsApp, legal

### ✅ Fase 6 — Legal (Ley 8968 CR)
- `app/privacidad/page.tsx` — política de privacidad completa (10 secciones, PRODHAB, ARCO)
- `app/terminos/page.tsx` — términos de uso (10 secciones)
- `app/(auth)/registro/page.tsx` — checkbox "acepto términos" obligatorio antes de registrarse

### ✅ Fase 7 — Pulido y seguridad
- `lib/email/templates/` — 6 plantillas React Email (welcome, confirmation, cancellation, reminder, missed-you, admin-new-appointment)
- `lib/email/send.ts` — reescrito con render() de React Email
- `lib/rate-limit.ts` — sliding window rate limiter (signup 5/15min, login 10/10min, booking 8/h)
- `app/sitemap.ts`, `app/robots.ts`
- `next.config.ts` — security headers completos (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, poweredByHeader: false)
- `middleware.ts` — rate limiting + redirect usuarios autenticados fuera de login/registro
- `app/admin/actions.ts` — sanitización de búsquedas, validación UUID en todos los IDs, timing-safe en cron

### ✅ Endurecimiento de seguridad y rendimiento (2026-06-02)
**Seguridad:**
- `app/api/cron/reminders/route.ts` — corregido bug CRON_SECRET vacío (acceso libre), import ESM de crypto, timing-safe mejorado
- `lib/validations.ts` + `app/auth/actions.ts` — contraseña requiere ≥1 mayúscula + ≥1 dígito
- `app/(auth)/layout.tsx`, `app/admin/layout.tsx`, `app/mi-cuenta/page.tsx` — `robots: noindex` en páginas privadas

**Rendimiento:**
- `app/booking/actions.ts` — `getActiveServices` y `getBookingSettings` cacheadas con `unstable_cache` (tags "services"/"settings", revalida cada 1h, cliente anon sin cookies)
- `app/admin/actions.ts` — `upsertServiceType`, `toggleServiceType`, `updateSettings` invalidan el cache público con `revalidateTag` + `revalidatePath`
- `app/sobre-mi`, `app/recursos`, `app/privacidad`, `app/terminos` — `revalidate = 86400` (ISR 24h)
- `app/reservar/loading.tsx`, `app/admin/loading.tsx` — skeletons de streaming

### ✅ Pulido mobile y UX admin (2026-06-02)
- `components/header.tsx` + `components/mobile-nav.tsx` — link "Panel admin" visible solo para admins (consulta `profiles.role`)
- `components/admin/admin-calendar.tsx` — en mobile reemplaza react-big-calendar con mini-cal + lista de citas del día seleccionado
- `components/mobile-nav.tsx` — links nav con `text-foreground` y más padding, visualmente obvios como elementos clickeables

### ✅ DEPLOY DEMO — https://sandra-citas.vercel.app (live desde 2026-06-02)

---

## Demo vs Producción

| | Demo (.vercel.app) | Producción (psicologasandra.com) |
|---|---|---|
| **Hosting** | Vercel Hobby (gratis) | Vercel Hobby o Pro |
| **Dominio** | `*.vercel.app` | `psicologasandra.com` |
| **Emails** | `onboarding@resend.dev` (solo al dueño de cuenta Resend) | `citas@psicologasandra.com` (verificar dominio) |
| **Cron recordatorios** | 1×/día a las 6am UTC | Hourly (requiere Pro) o 1×/día |
| **Objetivo** | Mostrarle la demo a Sandra | Lanzamiento real |

---

## Checklist de deploy DEMO (gratis, .vercel.app)

**Todo completado:**
- [x] `.gitignore` creado (incluye `.claude/`)
- [x] `vercel.json` — cron ajustado a diario (`0 6 * * *`)
- [x] `lib/email/send.ts` — FROM cambiado a `onboarding@resend.dev`
- [x] Repo GitHub: `diegoselva7x/sandra-citas` (privado)
- [x] Deploy en Vercel con 6 env vars configuradas
- [x] Supabase redirect URL configurada
- [x] Registro y login funcionan en la demo

**Próximos pasos (con datos de Sandra):**
1. Reactivar "Confirm email" en Supabase → Authentication → Sign In/Providers → Email (fue desactivado para testing)
2. Sandra se registra → correr SQL: `UPDATE profiles SET role='admin' WHERE email='CORREO_SANDRA';`
3. Sandra configura en `/admin/configuracion`: WhatsApp, email, disponibilidad, servicios
4. Agregar contenido (ver `docs/CONTENIDO-PENDIENTE.md`)
5. Agregar foto (`public/foto-sandra.jpg`) y og-image (`public/og-image.jpg`)

---

## Para producción (cuando se tenga el dominio)

1. Verificar dominio en Resend (SPF/DKIM/DMARC)
2. Cambiar FROM en `lib/email/send.ts` a `citas@psicologasandra.com`
3. Cambiar `NEXT_PUBLIC_SITE_URL` a `https://psicologasandra.com` en Vercel
4. Agregar dominio en Vercel y actualizar redirect URLs en Supabase
5. Si se quiere cron horario: upgrade a Vercel Pro y cambiar `vercel.json` a `"0 * * * *"`

---

## Stack
- Next.js 16 (App Router) + TypeScript
- Supabase: Postgres + Auth + RLS
- Resend + React Email (correos transaccionales)
- Vercel Cron (recordatorios 24h)
- Tailwind CSS + shadcn/ui
- react-big-calendar (calendario del admin)
- react-hook-form + zod (formularios)
- date-fns + date-fns-tz (fechas, siempre en `America/Costa_Rica`)

## Reglas de arquitectura (NO romper)
- **RLS activo en todas las tablas. Nunca desactivarlo.**
- Clientes NUNCA escriben directo en `appointments`. Solo vía RPC: `book_appointment`, `cancel_appointment`, `reschedule_appointment`.
- Notas clínicas (`appointment_notes`): solo admin. Nunca exponerlas al cliente.
- `lib/supabase/admin.ts` (service-role key): SOLO servidor. Nunca en `"use client"`.
- Todas las fechas en **UTC** en DB; mostrar en `America/Costa_Rica` (constante `TIMEZONE`).
- Todo input se valida con Zod antes de tocar la DB.
- Zod datetime fields siempre con `{ offset: true }` — Supabase retorna `+00:00`.

## Modelo de auth
- Email + contraseña. Verificación obligatoria antes de reservar.
- Registro: nombre, email, teléfono, contraseña. Sin cédula.
- Sandra es el único `admin`; todos los demás son `client`.

## Reglas de producto / UX
- **Asuntos de correo neutrales**: nunca "psicología" (dispositivos compartidos).
- Correos automáticos: bienvenida, verificación, reset, cita creada/reagendada/cancelada, recordatorio 24h, no-show. Sin correo de "completada".
- No-show: correo empático ("Te extrañamos…"), nunca acusatorio.
- Modalidad online: Sandra manda el link por WhatsApp. El sistema NO gestiona el link.
- Tono: cálido, profesional, sin jerga clínica.

## Dónde está cada cosa
- `supabase/migrations/` — esquema (0001), funciones/RPC (0002), RLS (0003)
- `lib/supabase/{server,client,admin}.ts` — clientes de Supabase
- `lib/email/send.ts` + `lib/email/templates/` — correos
- `lib/validations.ts`, `lib/types.ts`, `lib/rate-limit.ts`
- `app/booking/actions.ts` — server actions públicos
- `app/admin/actions.ts` — server actions del admin
- `app/api/cron/reminders/route.ts` — cron de recordatorio 24h
- `middleware.ts` — sesión, rate limiting, protección de rutas

## Convenciones de código
- Comentarios y textos UI en español. Identificadores en inglés.
- Server Components por defecto; `"use client"` solo cuando haga falta interactividad.
- Mensajes de error: español, claros y amables.
- Mobile-first.
- No tocar migraciones aplicadas; si hay cambio de esquema → crear `0004_...` nuevo.

## Colores de marca — PENDIENTE (Sandra no ha elegido)

La paleta actual es completamente grayscale (chroma=0 en oklch). Cuando Sandra decida colores:

- Solo tocar `app/globals.css` líneas 52-85 (bloque `:root`) — no hay cambios en componentes
- Variables clave: `--primary`, `--primary-foreground`, `--accent`, `--accent-foreground`, `--ring`
- Ejemplo para psicología (teal suave): `--primary: oklch(0.55 0.12 180)` → cero cambios en el resto del código
- El color destructive (rojo para errores) ya tiene chroma, no hay que tocarlo

---

## Contenido pendiente de Sandra — 19 textos + 3 imágenes

Ver `docs/CONTENIDO-PENDIENTE.md` para la lista detallada.

**Resumen:**
- Home: 4 textos (hero, bio breve, dirección)
- Sobre mí: 8 textos (bio completa, formación, enfoque)
- Servicios: 2 textos (descripción, dirección+horario)
- Contacto: 2 textos (dirección, horario)
- Recursos: 5 perspectivas personales
- Assets: foto profesional, og-image.jpg (1200×630), favicon.ico

---

## Documentación

- `docs/RESUMEN-PROYECTO.md` — resumen técnico de todo lo construido
- `docs/GUIA-USUARIO.md` — guía paso a paso para pacientes
- `docs/GUIA-ADMIN.md` — guía para Sandra (cómo usar el panel)
- `docs/CONTENIDO-PENDIENTE.md` — lista completa de lo que Sandra debe proveer

---

## Cómo trabajar con Claude Code
- No inventar contenido de Sandra: usar placeholders `TODO: contenido de Sandra`.
- Ejecutar comandos directamente sin pedir permiso primero.
