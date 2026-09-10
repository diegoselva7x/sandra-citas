# Visibilidad en buscadores y en IA

> **Estado (10 sep 2026):** el sitio está en producción en `https://sandracarpio.com`,
> verificado en Google Search Console, con el sitemap enviado e indexación solicitada.
> Googlebot ya lo está rastreando. Falta lo que no depende del código.

## Lo que ya está hecho

- **Dominio propio** `sandracarpio.com` (apex y `www`), sobre Cloudflare Workers.
- **Canonical, sitemap, robots, OG y JSON-LD** apuntando todos al dominio real.
  Antes apuntaban a un dominio que no resolvía, y eso por sí solo impedía que
  Google indexara: no indexa una página cuyo canonical señala a otro lado roto.
- **Search Console**: propiedad de dominio verificada por registro TXT, sitemap
  enviado, indexación de la home solicitada.
- **JSON-LD** con `@type: Psychologist`, horario derivado de `availability_rules`
  (si Sandra cambia su horario en el panel, Google ve el cambio sin tocar código),
  teléfono en E.164 y `areaServed` nombrando Cartago.
- **`robots.txt` permite explícitamente los bots de IA** (GPTBot, OAI-SearchBot,
  ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended), y
  en Cloudflare **ninguno está bloqueado** — conviene revisarlo cada tanto, porque
  Cloudflare a veces activa bloqueos de crawlers de IA por defecto en zonas nuevas.
- **`llms.txt`** publicado, con el resumen del sitio para asistentes.

## Lo que falta — y no es código

### 1. Google Business Profile 🔴 lo más importante
Para "psicóloga en Cartago" esto pesa más que todo el sitio junto: es lo que sale
en el **mapa**, mucho antes de que la web rankee. Es gratis.

- Lo crea **Sandra** en https://business.google.com con la dirección del consultorio.
- Google verifica por teléfono, video o postal — **la postal tarda semanas**, así
  que conviene arrancarlo cuanto antes.
- Completar: categoría (Psicólogo / Psicoterapeuta), horario, teléfono de WhatsApp,
  fotos y el enlace a sandracarpio.com.

### 2. Enlaces que hagan descubrible el sitio 🟡
- El enlace en el **LinkedIn** de Sandra y en la **bio de Instagram**.
- Directorios de salud: **Doctoralia**, **HuliHealth**.
- Sirven para que Google descubra el sitio y para darle autoridad.

### 3. Contenido y paciencia 🟡
- Completar `/recursos` con la perspectiva real de Sandra; hoy es contenido base.
- **Indexar** toma de días a semanas. **Rankear** para términos disputados toma
  meses. Aparecer en respuestas de IA depende sobre todo de señales externas y es
  todavía más lento. Nada de esto se acelera tocando el código.

### 4. Datos que solo Sandra tiene
- Número de colegiatura, dirección y horario exactos.
- Reseñas reales: sin ellas el negocio no compite en el mapa. No se inventan.

## Pendientes menores del sitio

- `settings.contact_email` está vacío, así que la sección de correo no aparece en
  la home ni en Contacto, y el formulario de contacto queda sin destinatario.
- No hay analítica instalada. Cloudflare Web Analytics es gratis y sin cookies.
