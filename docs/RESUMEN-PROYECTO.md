# Resumen del Proyecto — psicologasandra.com

## Qué se construyó

Sitio web profesional completo para **Sandra Carpio**, psicóloga en Costa Rica. Incluye:
- Sitio público (presentación, servicios, recursos educativos, contacto)
- Sistema de reservas de citas en línea (wizard 4 pasos)
- Portal del paciente (ver citas, cancelar, reagendar, editar perfil)
- Panel de administración completo para Sandra

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) + TypeScript | Framework principal |
| **Supabase** (PostgreSQL + Auth + RLS) | Base de datos + autenticación |
| **Resend + React Email** | Correos transaccionales (6 plantillas) |
| **Tailwind CSS + shadcn/ui** | Estilos y componentes |
| **Vercel** | Hosting + Cron jobs |
| **react-big-calendar** | Calendario del admin |
| **react-hook-form + Zod** | Formularios con validación |
| **date-fns-tz** | Fechas siempre en `America/Costa_Rica` |

---

## Páginas construidas (18 total)

### Públicas (7)

| Ruta | Descripción |
|---|---|
| `/` | Inicio: hero, servicios desde DB, modalidades, CTA de reserva |
| `/sobre-mi` | Biografía, formación, enfoque terapéutico |
| `/servicios` | Listado dinámico de servicios con precios (₡) |
| `/recursos` | 5 artículos educativos sobre salud mental |
| `/contacto` | Formulario mailto + datos de contacto |
| `/privacidad` | Política de privacidad (Ley 8968 CR / PRODHAB) |
| `/terminos` | Términos de uso |

### Autenticación (4)

| Ruta | Descripción |
|---|---|
| `/registro` | Crear cuenta (nombre, email, teléfono, contraseña) |
| `/login` | Iniciar sesión |
| `/auth/recuperar` | Solicitar reset de contraseña por email |
| `/auth/restablecer` | Crear nueva contraseña |

### Portal del paciente (2) — requiere sesión

| Ruta | Descripción |
|---|---|
| `/reservar` | Wizard de reserva en 4 pasos |
| `/mi-cuenta` | Mis citas (próximas/pasadas), cancelar, reagendar, editar perfil |

### Panel admin (5) — solo Sandra

| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard: citas del día, estadísticas de la semana |
| `/admin/citas` | Lista filtrable + vista calendario |
| `/admin/pacientes` | Búsqueda + ficha por paciente |
| `/admin/pacientes/[id]` | Historial completo + notas clínicas privadas |
| `/admin/configuracion` | Horarios, servicios, bloqueos, datos del sitio |

---

## Componentes personalizados (17)

| Componente | Descripción |
|---|---|
| `Header` | Barra de navegación con estado de sesión |
| `Footer` | Pie de página con nav, WhatsApp y legales |
| `MobileNav` | Menú hamburguesa (Sheet deslizable) |
| `BookingWizard` | Orquestador del wizard de reserva |
| `StepService` | Paso 1: selección de servicio |
| `StepModality` | Paso 2: presencial u online |
| `StepSchedule` | Paso 3: selector de fecha/hora |
| `StepConfirm` | Paso 4: resumen y confirmación |
| `BookingSuccess` | Pantalla de éxito post-reserva |
| `AccountTabs` | Pestañas "Mis citas" y "Mi perfil" |
| `AppointmentCard` | Tarjeta de cita con acciones |
| `CancelDialog` | Diálogo de confirmación de cancelación |
| `RescheduleDialog` | Diálogo de reagendamiento |
| `ProfileForm` | Formulario de edición de perfil |
| `CitasClient` | Vista administración de citas con filtros |
| `AdminCalendar` | Calendario mensual/semanal (react-big-calendar) |
| `ConfigClient` | Panel de configuración con pestañas |

Más 17 primitivos de shadcn/ui (Button, Card, Dialog, Table, etc.)

---

## Correos automáticos (6 plantillas React Email)

| Plantilla | Cuándo se envía |
|---|---|
| Bienvenida | Al registrarse |
| Confirmación de cita | Al reservar o reagendar |
| Cancelación | Al cancelar una cita |
| Recordatorio | 24h antes de la cita (cron diario) |
| "Te extrañamos" | Cuando Sandra marca no-show |
| Notificación admin | A Sandra cuando alguien reserva |

> **Demo:** Los correos salen de `onboarding@resend.dev` y solo llegan al email del dueño de la cuenta Resend.
> **Producción:** Cambiar a `citas@psicologasandra.com` tras verificar dominio en Resend.

---

## Seguridad implementada

- **RLS activo** en todas las tablas de Supabase
- **RPCs** para operaciones de cita (previenen doble-reserva con `EXCLUDE` constraint en Postgres)
- **Rate limiting** por IP: 5 registros/15min, 10 logins/10min, 8 reservas/hora
- **Security headers**: CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy
- **Notas clínicas aisladas**: solo visibles para admin, nunca al paciente
- **Validación Zod** en todos los inputs (frontend + server actions)
- **Contraseña con complejidad**: mínimo 8 caracteres, 1 mayúscula, 1 número
- **Cron protegido** con `CRON_SECRET` + comparación timing-safe
- **Páginas privadas no indexadas**: login, registro, mi-cuenta, admin
- **Ley 8968 CR**: política de privacidad completa, derechos ARCO, info PRODHAB

---

## Datos dinámicos (desde DB)

Los siguientes datos se gestionan desde el panel admin, no están hardcodeados:

- Servicios (nombre, descripción, precio, duración, activo/inactivo)
- Horarios de disponibilidad semanal
- Bloqueos de fechas (vacaciones, días libres)
- WhatsApp, email de contacto
- Toggle "aceptando pacientes nuevos"

---

## Diseño visual

- Paleta cálida (blanco cálido, crema, beige arena) con **lila pastel** `oklch(0.795 0.09 300)` como único acento, definida en `app/globals.css` (`:root`).
- Tipografía serif **Playfair Display** en titulares + **Inter** en cuerpo (vía `next/font`, self-hosted).
- Componentes compartidos en `components/ui/` (`Section`, `PageHeader`, `SuccessMessage`, `EmptyState`, `StatusBadge`) + `scroll-reveal`.
- Contraste WCAG real; Lighthouse A11Y/SEO 100.

## Contenido y assets (entregados por Sandra — jun 2026)

- Biografía, "Mi historia", enfoque y credenciales reales en `/sobre-mi` (EMDR, DBT, DBR, EFT, hipnosis clínica; formación académica).
- Fotos profesionales estandarizadas en `public/`: `sandra-principal.jpg`, `sandra-retrato.jpg`, `sandra-sesion.jpg`, `certificado-dbt.jpg`, `logo.png` (optimizado a 3 KB), `og-image.jpg` (1200×630).

## Rendimiento

- Imágenes servidas en **AVIF/WebP** con cache de 1 año (`next.config.ts`).
- **Blur placeholders (LQIP)** en las fotos principales (`lib/image-blur.ts`).
- Datos de servicios/settings cacheados con `unstable_cache` (1 h); páginas estáticas con ISR 24 h.

## SEO / GEO

- Metadata completa por página (título, descripción, Open Graph, Twitter, canonical, keywords).
- **JSON-LD `@graph`** en la landing: `WebSite` + `LocalBusiness/MedicalBusiness` + `Person` (señales E-E-A-T).
- `sitemap.xml`, `robots.txt` y **`llms.txt`** (ficha para motores de IA).

## Estado: listo para entregar (código)

- Build + TypeScript en verde; **lint con 0 errores**.
- Todas las páginas públicas responden 200; rutas privadas protegidas.
- Repo limpio (sin rastros de asistente IA, historial profesional).

## Pendiente (no es código)

### Configuración con datos de Sandra
- Reactivar "Confirm email" en Supabase; hacerla `admin` por SQL.
- Cargar en `/admin/configuracion`: WhatsApp, email, disponibilidad semanal, servicios y precios.
- Correr migraciones `0004_seed.sql` y `0005_contact_fields.sql` si faltan.

### Contenido fino aún por aportar
- Perspectivas personales para los 5 artículos de `/recursos` (hoy con contenido base genérico).
- Número de colegiatura, horario exacto y dirección textual (van por el admin).

### Dominio y producción
- Deploy demo: URL `.vercel.app` (Hobby, gratuito).
- Producción: dominio `psicologasandra.com`, verificar Resend, Vercel Pro para cron horario.
