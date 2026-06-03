# Resumen del Proyecto — psicologasandra.com

## Qué se construyó

Sitio web profesional completo para **Sandra Mora**, psicóloga en Costa Rica. Incluye:
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

## Pendiente

### Contenido de Sandra (19 textos + 3 imágenes)
Ver `docs/CONTENIDO-PENDIENTE.md` para la lista completa.

### Colores de marca
- Actualmente el sitio es completamente grayscale
- Cuando Sandra elija su paleta, se aplican en ~10 líneas de `app/globals.css`
- Cero cambios en componentes

### Dominio y producción
- Deploy demo: URL `.vercel.app` (Hobby, gratuito)
- Producción: dominio `psicologasandra.com`, verificar Resend, Vercel Pro para cron horario
