# Guía de lanzamiento y SEO — pasos pendientes

> **Estado (jun 2026):** el sitio está **terminado a nivel de código** y desplegado
> en `https://sandra-citas.vercel.app`, pero **todavía no aparece en Google**.
> Esto **no es un problema del código ni del dominio de Vercel**: es un sitio nuevo
> que Google aún no ha descubierto ni indexado. Esta guía son los pasos de
> **configuración** (no de código) para que empiece a aparecer en búsquedas.

## Por qué aún no sale en Google

- Es un sitio **nuevo**: nadie le ha avisado a Google que existe.
- No está dado de alta en **Google Search Console** ni se envió el sitemap.
- No tiene **enlaces externos** que lo hagan descubrible.
- Aunque se haga todo bien, **indexar toma días o semanas**, y **rankear** para
  términos competidos (ej. "psicóloga en Cartago") toma meses.

El SEO técnico ya está hecho y es correcto (metadata, JSON-LD, sitemap, robots,
`llms.txt`) — pero eso le dice a Google *cómo entender* el sitio, no lo hace *entrar*.

---

## Orden recomendado (de mayor a menor impacto)

### 1. Google Business Profile (lo más importante para una psicóloga local) 🟢
Es **gratis** y es lo que aparece en el **mapa** de Google (el "pack local"), mucho
antes de que la web rankee. Para queries como "psicóloga en Cartago", esto es lo
que más mueve la aguja.
- Lo crea **Sandra** en https://business.google.com con la dirección del consultorio.
- Google verifica por teléfono/postal/video.
- Completar: categoría (Psicólogo/Psicoterapeuta), horario, teléfono (WhatsApp),
  fotos, y el enlace al sitio web.

### 2. Decidir el dominio ANTES de forzar la indexación 🟡
Decisión clave:
- Si se va a usar **psicologasandra.com pronto** → **NO** indexar el `.vercel.app`.
  Conviene indexar directamente el dominio real (si no, hay que migrar y que Google
  re-indexe todo de nuevo con redirects).
- Si el dominio real está **lejos (meses)** → se puede indexar el `.vercel.app`
  ahora y migrar después con redirects 301.

### 3. Conectar el dominio real (cuando se tenga) 🟢
1. Comprar `psicologasandra.com` (a nombre de Sandra).
2. En Vercel: agregar el dominio al proyecto y apuntar el DNS.
3. **Actualizar `NEXT_PUBLIC_SITE_URL` = `https://psicologasandra.com`** en las
   env vars de Vercel (de esto dependen canonical, OG, sitemap, robots y todos los
   JSON-LD). Re-deploy.
4. Actualizar las **redirect URLs** en Supabase (Auth) al dominio real.

### 4. Google Search Console (esto dispara la indexación) 🟢
En https://search.google.com/search-console:
1. Verificar la propiedad del **dominio elegido** (idealmente el real).
2. Enviar el **sitemap**: `https://<dominio>/sitemap.xml`.
3. **Inspeccionar URL → Solicitar indexación** para la home y las páginas clave
   (`/`, `/sobre-mi`, `/servicios`, `/contacto`, `/recursos`).
4. Repetir la solicitud de indexación tras publicar contenido nuevo.

### 5. Backlinks / señales de descubrimiento 🟡
- Poner el enlace al sitio en el **LinkedIn** de Sandra (ya tiene perfil:
  "Sandra Carpio Monge — Master en psicología clínica") y en la **bio de Instagram**.
- Alta en directorios: **Doctoralia**, **HuliHealth**, etc.
- Estos enlaces ayudan a que Google descubra el sitio y le dé autoridad.

### 6. Contenido + tiempo 🟡
- Completar `/recursos` con la **perspectiva real de Sandra** (hoy es contenido base).
- Esperar: indexación (días-semanas) y ranking (meses). Es normal.

---

## Resumen de producción (cuando haya dominio)

1. Verificar dominio en **Resend** (SPF/DKIM/DMARC) y cambiar el `FROM` en
   `lib/email/send.ts` a `citas@psicologasandra.com`.
2. `NEXT_PUBLIC_SITE_URL` = `https://psicologasandra.com` en Vercel.
3. Dominio en Vercel + redirect URLs en Supabase.
4. Reactivar "Confirm email" en Supabase y hacer `admin` a Sandra (ver `SETUP.md`).
5. Correr migraciones `0004_seed.sql` y `0005_contact_fields.sql` si faltan.
6. (Opcional) Vercel Pro para cron horario de recordatorios.

---

## Lo que pertenece a Sandra (no es código)
- Crear y verificar **Google Business Profile**.
- Aportar contenido real de `/recursos`, número de colegiatura, horario y dirección exactos.
- Decidir y comprar el dominio.
