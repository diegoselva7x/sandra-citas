# Despliegue

Estado a partir del lanzamiento del 9 de septiembre de 2026.

## Dónde vive cada cosa

| Pieza | Dónde | Notas |
|---|---|---|
| Dominio | Cloudflare Registrar, cuenta **Kuro Studio** (`Studiokuro.cr@gmail.com`) | `sandracarpio.com`. La titularidad es de Sandra; ver contrato. |
| Sitio | Cloudflare Workers, worker `sandra-citas` | Dominios: `sandracarpio.com` y `www.sandracarpio.com` |
| Build | Cloudflare Workers Builds, desde GitHub `diegoselva7x/sandra-citas`, rama `main` | Cada push a `main` compila y despliega |
| Base de datos | Supabase, proyecto `sandra-web` (`solldpkdxinyfgiftovk`) | |
| Correo | Resend, dominio `sandracarpio.com` verificado | Envía desde `citas@sandracarpio.com`, responde a `sandracarpio@gmail.com` |
| Recordatorios | Worker `sandra-citas-cron`, cron `0 * * * *` | Código fuente en `workers/cron/` |
| Rate limiting | Cloudflare KV, namespace `sandra-citas-rate-limit` | |

Vercel quedó fuera del proyecto el 10 de septiembre de 2026, una vez que la
operación en Cloudflare estuvo verificada. Ya no hay nada que mantener ahí.

## Comandos

```bash
npm run dev          # desarrollo local
npm run build        # build de Next, para verificar antes de subir
npm run cf:build     # build para Workers (ver limitación de Windows más abajo)
npm run cf:deploy    # build + deploy manual
npm run cron:deploy  # desplegar el worker de recordatorios
```

**Ojo en Windows:** `cf:build` falla con `EPERM: operation not permitted, symlink`
si el Modo Desarrollador está apagado, porque OpenNext crea enlaces simbólicos
al empaquetar. Se arregla activando Modo Desarrollador en Windows, o
simplemente dejando que compile Cloudflare Workers Builds al hacer push.

## Variables

**Build** (se incrustan en el bundle, van en la config de Workers Builds):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

**Runtime** (secretos del worker `sandra-citas`):
`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, más
`NEXT_PUBLIC_SITE_URL` como variable normal.

**Worker de cron** (`sandra-citas-cron`): `SITE_URL` y `CRON_SECRET`.

Los clientes de Supabase-admin y Resend se crean en el primer uso, no al
importar el módulo, justamente para que el contenedor de build no necesite los
secretos de runtime. No volver a inicializarlos a nivel de módulo.

## Sin ISR

No hay `export const revalidate` ni `revalidateTag` en el proyecto, y
`open-next.config.ts` no declara `incrementalCache` a propósito. El layout raíz
lee la sesión, así que todo se renderiza por request de todos modos. Si algún
día se agrega una página con ISR, hay que crear el bucket R2 y activar
`r2IncrementalCache`.

## Probar el cron a mano

```bash
curl https://sandra-citas-cron.studiokuro-cr.workers.dev/ \
  -H "Authorization: Bearer $CRON_SECRET"
```

Responde `{"procesadas":N,"enviados":N,"fallidos":[]}`. Sin el token, 401.
