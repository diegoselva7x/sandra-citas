# ROADMAP — Plan de construcción

El backend ya existe. Esto es lo que falta, en orden recomendado. Cada fase es
independiente y verificable. No empieces una fase sin tener la anterior funcionando.

> Construí primero el núcleo funcional (auth → reserva → cuenta → admin) y dejá
> las páginas públicas para cuando Sandra entregue el contenido. Mientras tanto,
> usá placeholders marcados `TODO: contenido de Sandra`.

---

## Fase 0 — Entorno (ver SETUP.md)
- [ ] Node + proyecto Next.js + archivos del backend integrados
- [ ] Supabase con las 3 migraciones aplicadas
- [ ] `.env.local` completo, `npm run dev` levanta sin errores
- [ ] shadcn/ui inicializado: `npx shadcn@latest init`

---

## Fase 1 — Autenticación (UI)
La base de todo lo demás. Usa `lib/supabase/client.ts` / `server.ts` y los
esquemas de `lib/validations.ts`.
- [ ] `/registro` — formulario (nombre, email, teléfono, contraseña) → `signUp`
- [ ] Pantalla "revisá tu correo para verificar" tras registrarse
- [ ] `/login` — email + contraseña
- [ ] `/auth/callback` — maneja el link de verificación de Supabase
- [ ] Recuperar contraseña (solicitar + restablecer)
- [ ] Logout
- [ ] Estado de sesión visible en el header (entrar / mi cuenta / salir)

**Listo cuando:** un usuario se registra, verifica su correo, inicia y cierra sesión.

---

## Fase 2 — Flujo de reserva
Depende de Fase 1. El usuario debe estar logueado y verificado para reservar.
- [ ] `/reservar` — paso 1: elegir servicio (lee `service_types` activos)
- [ ] paso 2: elegir modalidad (online / presencial). Si online, mostrar aviso de
      "Sandra te enviará el link por WhatsApp" + botón de WhatsApp
- [ ] paso 3: calendario de horarios libres (llama al RPC `get_available_slots`)
- [ ] paso 4: confirmar → server action `bookAppointment`
- [ ] Pantalla de confirmación + correo automático (ya implementado en el backend)
- [ ] Si el cupo está cerrado (`accepting_new_patients = false`), manejar el mensaje

**Listo cuando:** un usuario reserva un slot real y le llega el correo; el slot
deja de aparecer como disponible.

---

## Fase 3 — "Mi cuenta" (portal del paciente)
- [ ] `/mi-cuenta` — lista de mis citas (próximas y pasadas), protegida por middleware
- [ ] Cancelar cita → `cancelAppointment`
- [ ] Reagendar cita → `rescheduleAppointment` (reusar el calendario de Fase 2)
- [ ] Editar mi perfil (nombre, teléfono)

**Listo cuando:** el paciente ve, cancela y reagenda sus propias citas, y no las de nadie más.

---

## Fase 4 — Panel de administración (Sandra)
La parte más grande. Todo bajo `/admin`, protegido por el middleware (solo `admin`).
- [ ] Dashboard: próximas citas del día / semana
- [ ] Vista **lista** de citas con filtros (estado, fecha)
- [ ] Vista **calendario** (react-big-calendar), semanal y mensual
- [ ] Buscar paciente por nombre / email / teléfono
- [ ] **Ficha de paciente**: datos + historial de todas sus citas
- [ ] Crear cita manualmente (para los que escriben por WhatsApp)
- [ ] Cambiar estado de cita: confirmada / completada / no-show / cancelada
      (al marcar no-show, ofrecer enviar el correo "Te extrañamos")
- [ ] Configurar disponibilidad recurrente (`availability_rules`)
- [ ] Bloquear fechas (`date_blocks`): vacaciones, días libres
- [ ] Toggle "aceptando pacientes nuevos" (`settings.accepting_new_patients`)
- [ ] Notas privadas por cita (`appointment_notes`, solo admin)
- [ ] Editar contenido del sitio (servicios, precios, datos de contacto)

**Listo cuando:** Sandra puede operar toda su agenda sin tocar la base de datos.

---

## Fase 5 — Páginas públicas
Necesitan el contenido real de Sandra. Estructurá con placeholders mientras llega.
- [ ] Inicio (hero, presentación, CTA a reservar)
- [ ] Sobre mí (bio, formación, enfoque)
- [ ] Servicios (desde `service_types`)
- [ ] Contenido educativo (por qué buscar ayuda; familia, pareja, salud mental)
- [ ] Contacto (formulario + redes + WhatsApp)
- [ ] Diseño cálido y mobile-first; foto profesional de Sandra

**Listo cuando:** el sitio comunica quién es Sandra y lleva a reservar.

---

## Fase 6 — Legal (Costa Rica, Ley 8968)
- [ ] Política de privacidad (qué datos se guardan, para qué, cómo pedir borrado)
- [ ] Términos de uso básicos
- [ ] Checkbox de aceptación en el registro
- [ ] Aviso/banner de cookies si se usan analíticas

---

## Fase 7 — Pulido y entrega
- [ ] Plantillas de correo lindas con React Email (reemplazar el HTML inline de `send.ts`)
- [ ] Verificar dominio en Resend (SPF/DKIM/DMARC) — sin esto, correos a spam
- [ ] SEO básico (metadata, Open Graph, sitemap, favicon)
- [ ] QA responsive (celular, tablet, desktop)
- [ ] Revisar todos los flujos de correo de punta a punta
- [ ] Deploy final + prueba en producción + handoff a Sandra (mini guía de uso del panel)

---

## Notas
- Cualquier cambio de esquema = **migración nueva** (`0005_...`), no editar las aplicadas.
- Documentá cualquier decisión nueva de arquitectura o producto para mantener el contexto del proyecto.
