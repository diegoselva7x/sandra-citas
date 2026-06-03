# Contenido Pendiente — Sandra necesita proveer

Total: **19 textos + 3 archivos de imagen**

---

## Imagen profesional (usada en 2 lugares)

Una sola foto, se usa en `/` (home) y `/sobre-mi`. Preferiblemente fondo claro, formato cuadrado o vertical.
Subir como: `public/foto-sandra.jpg` (o similar, luego actualizar la ruta en el código)

---

## Página: Inicio (`/`)

| # | Qué necesito | Dónde va |
|---|---|---|
| 1 | **Título principal del hero** (ej: "Encontrá el equilibrio que necesitás" — algo que la represente) | Encima del subtítulo |
| 2 | **Subtítulo del hero** (1-2 oraciones describiendo su propuesta de valor) | Bajo el título |
| 3 | **Presentación breve** (2-3 líneas en tono cálido para la sección "Hola, soy Sandra") | Sección de bienvenida |
| 4 | **Dirección del consultorio** (ej: Sabana Norte, San José) | Tarjeta "Presencial" en modalidades |

---

## Página: Sobre mí (`/sobre-mi`)

| # | Qué necesito | Dónde va |
|---|---|---|
| 5 | **Nombre completo y título profesional** (ej: "Sandra Mora — Psicóloga Clínica") | Encabezado de la página |
| 6 | **Descripción corta** (1 oración) | Bajo el nombre |
| 7 | **Párrafo 1 de biografía**: motivación personal para ser psicóloga | Sección "Mi historia" |
| 8 | **Párrafo 2 de biografía**: experiencia y áreas de trabajo | Sección "Mi historia" |
| 9 | **Párrafo 3 de biografía**: valores y forma de trabajar con los pacientes | Sección "Mi historia" |
| 10 | **Formación: Licenciatura** (universidad, año de egreso) | Sección "Formación" |
| 11 | **Formación: Especialización o maestría** (si aplica) | Sección "Formación" |
| 12 | **Cursos y certificaciones adicionales** relevantes | Sección "Formación" |
| 13 | **Número de colegiatura** (Colegio Profesional de Psicólogos de CR) | Sección "Formación" |
| 14 | **Enfoque terapéutico**: tipo de enfoque (ej: cognitivo-conductual, sistémico) + descripción de cómo trabaja con los pacientes | Sección "Mi enfoque" |

---

## Página: Servicios (`/servicios`)

| # | Qué necesito | Dónde va |
|---|---|---|
| 15 | **Descripción general de los servicios** (1-2 párrafos intro) | Encabezado de la sección de servicios |
| 16 | **Dirección del consultorio + horario de atención** | Sección "Atención presencial" |

> Los servicios en sí (nombre, descripción, precio, duración) se configuran desde el panel admin `/admin/configuracion`

---

## Página: Contacto (`/contacto`)

| # | Qué necesito | Dónde va |
|---|---|---|
| 17 | **Dirección del consultorio** | Tarjeta de ubicación |
| 18 | **Horario de atención** (ej: Lunes a viernes, 8am–5pm) | Tarjeta de horario |

> El email y WhatsApp se configuran desde el admin, no hay que tocar código

---

## Página: Recursos (`/recursos`)

Los 5 artículos tienen estructura y contenido base ya escrito. Solo necesito que Sandra los **personalice con su perspectiva**:

| # | Artículo | Qué agregar |
|---|---|---|
| 19a | "¿Por qué buscar apoyo psicológico?" | Su perspectiva personal sobre normalizar la terapia |
| 19b | "¿Qué esperar de la primera consulta?" | Cómo ella conduce la primera sesión concretamente |
| 19c | "Señales de que la pareja se beneficiaría de terapia" | Su experiencia en terapia de pareja |
| 19d | "Orientación familiar: cuándo buscar ayuda" | Su perspectiva sobre el trabajo con familias |
| 19e | "Cuidado de la salud mental en el día a día" | Consejos prácticos y su visión profesional |

---

## Archivos de imagen

| Archivo | Especificaciones | Uso |
|---|---|---|
| `public/foto-sandra.jpg` | Foto profesional, calidad alta, fondo claro preferiblemente | Home + Sobre mí |
| `public/og-image.jpg` | **1200 × 630 px**, para compartir en redes sociales / WhatsApp / Google | Meta tags OG |
| `public/favicon.ico` | 32×32 px o ICO multi-tamaño | Pestaña del navegador |

---

## Datos que van directo al admin (sin tocar código)

Sandra puede configurar esto directamente en `/admin/configuracion`:

- Email de contacto del sitio
- Número de WhatsApp
- Instrucciones para citas online
- Horarios de disponibilidad semanal
- Servicios (nombre, precio, duración, descripción)
- Bloqueo de fechas (vacaciones, etc.)

---

## Setup inicial con los datos de Sandra (una sola vez)

Cuando Sandra te dé su correo real, hay que correr este SQL en Supabase → SQL Editor:

```sql
-- 1. Convertirla en admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'CORREO_REAL_DE_SANDRA';

-- 2. Configurar WhatsApp y email de contacto
UPDATE public.settings
SET whatsapp_number = 'NUMERO_WHATSAPP',
    contact_email   = 'CORREO_DE_CONTACTO'
WHERE id = 1;
```

El archivo `supabase/migrations/0004_seed.sql` ya tiene el script completo con disponibilidad de ejemplo y servicios de ejemplo. Solo hay que actualizar el correo y correrlo.
