# SETUP — Puesta en marcha desde cero

Guía pensada para alguien que **nunca ha usado Supabase**. Seguí los pasos en
orden. Después de cada bloque grande, verificá antes de continuar.

---

## 0. Requisitos previos

Necesitás **Node.js 18 o superior**. Verificá en la terminal:

```bash
node --version
```

- Si dice `v18`, `v20` o mayor → listo.
- Si dice "command not found" o una versión vieja → instalá Node LTS desde
  https://nodejs.org (botón "LTS"). En Mac también sirve `brew install node`.

Verificá también git:

```bash
git --version
```

---

## 1. Crear el proyecto Next.js e integrar el backend

Los archivos que ya tenés (`lib/`, `app/`, `middleware.ts`, `supabase/`) asumen
un proyecto Next.js. Lo creamos y luego metemos esos archivos adentro.

1. Creá la app (en una carpeta vacía, fuera de donde están los archivos del backend):

   ```bash
   npx create-next-app@latest sandra-web
   ```

   Respondé así:
   - TypeScript → **Yes**
   - ESLint → **Yes**
   - Tailwind CSS → **Yes**
   - `src/` directory → **No**   ← importante, para que `lib/` y `app/` queden en la raíz
   - App Router → **Yes**
   - Turbopack → Yes (da igual)
   - Import alias `@/*` → **Yes** (dejá el default)

2. Copiá los archivos del backend dentro de `sandra-web/`, respetando las rutas:
   `lib/`, `app/booking/`, `app/api/`, `middleware.ts`, `supabase/`,
   `ROADMAP.md`, `SETUP.md`, `.env.example`.

3. Instalá las dependencias del backend:

   ```bash
   cd sandra-web
   npm install @supabase/ssr @supabase/supabase-js resend date-fns date-fns-tz zod react-hook-form @hookform/resolvers
   ```

---

## 2. Supabase (base de datos + auth)

### 2.1 Crear cuenta y proyecto
1. Entrá a https://supabase.com y creá una cuenta (gratis, con GitHub o email).
2. "New project". Ponele nombre (ej. `sandra-web`), elegí una contraseña para la
   base de datos (guardala) y la región más cercana (ej. East US).
3. Esperá 1-2 minutos a que se aprovisione.

### 2.2 Correr las migraciones
Lo más simple para empezar: el editor SQL del dashboard.

1. En el proyecto → menú izquierdo → **SQL Editor** → "New query".
2. Abrí `supabase/migrations/0001_schema.sql`, copiá TODO su contenido, pegalo y
   dale **Run**. Debe decir "Success".
3. Repetí, en orden, con `0002_functions.sql` y `0003_rls.sql`.
4. **`0004_seed.sql` NO todavía** — ese va después de que Sandra cree su cuenta
   (ver paso 5).

### 2.3 Conseguir las llaves
Menú izquierdo → **Project Settings** → **API**. Vas a necesitar:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secreta, nunca al cliente)

### 2.4 Configurar el correo de verificación
Menú → **Authentication** → **Providers** → Email: dejá activado "Confirm email".
(Supabase manda los correos de verificación; para producción luego conviene
conectar Resend como SMTP, pero para desarrollar así funciona.)

---

## 3. Resend (correos de la app)

1. Creá cuenta en https://resend.com (gratis, 3.000 correos/mes).
2. **API Keys** → "Create API Key" → copiá el valor → `RESEND_API_KEY`.
3. La **verificación del dominio** (registros DNS) la hacés cuando ya tengas el
   dominio de Sandra comprado. Hasta entonces, para probar, Resend te deja enviar
   desde `onboarding@resend.dev` a tu propio correo. Ajustá el `FROM` en
   `lib/email/send.ts` temporalmente si querés probar el envío.

---

## 4. Variables de entorno

1. Copiá `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Llená cada valor con lo de los pasos 2 y 3.
3. Para `CRON_SECRET` generá algo aleatorio:
   ```bash
   openssl rand -hex 32
   ```
4. `NEXT_PUBLIC_SITE_URL` en desarrollo es `http://localhost:3000`.

`.env.local` ya está en `.gitignore` por defecto en Next.js — **nunca lo subas a git.**

---

## 5. Correr y verificar

```bash
npm run dev
```

Abrí http://localhost:3000. Todavía no hay UI (eso es la siguiente fase), pero la
app debe levantar sin errores de configuración.

**Prueba de que Supabase conecta** (después de tener al menos la auth UI o con un
script rápido): registrá una cuenta de prueba. Luego, para convertir a Sandra en
admin, editá el correo dentro de `0004_seed.sql` por el que ella usó al
registrarse y corré ese archivo en el SQL Editor.

---

## 6. Deploy (cuando ya haya algo que mostrar)

El proyecto ya está desplegado. El detalle completo —dónde vive cada pieza, qué
variables van en build y cuáles en runtime— está en `docs/DESPLIEGUE.md`.

En resumen: cada push a `main` lo compila y publica Cloudflare Workers Builds
sobre el worker `sandra-citas`, servido en sandracarpio.com.

---

## Opcional (más adelante): Supabase MCP
Existe un servidor MCP de Supabase que permite correr migraciones y consultar la
base directamente desde tu editor. Útil, pero **no lo necesitás para empezar** —
el SQL Editor del dashboard alcanza. Dejalo para cuando ya domines lo básico de
Supabase.
