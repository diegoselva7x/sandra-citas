# Guía de Administración — Sandra

Esta guía explica cómo usar el panel de administración del sitio para gestionar citas, pacientes y configuración.

---

## Acceder al panel

1. Iniciar sesión en `/login` con tu cuenta de administradora
2. Clic en **"Panel admin"** en la barra de navegación, o ir directamente a `/admin`

---

## 1. Dashboard (`/admin`)

Al entrar al panel ves un resumen del día y la semana:

- **Citas de hoy**: listado con hora, paciente, servicio, modalidad y estado
- **Estadísticas**: citas totales esta semana, confirmadas hoy, completadas esta semana

Desde aquí podés acceder rápidamente a cualquier sección con el menú lateral (escritorio) o la barra inferior (móvil).

---

## 2. Gestionar citas (`/admin/citas`)

### Vista lista

- Filtrá por **estado**: Todas, Confirmadas, Completadas, No-show, Canceladas
- Filtrá por **rango de fechas**
- **Buscá** por nombre o email del paciente
- Hacé clic en cualquier cita para ver el **detalle completo**

### Vista calendario

- Clic en **"Ver calendario"** para cambiar a vista mensual o semanal
- Los colores indican el estado:
  - **Azul**: Confirmada
  - **Verde**: Completada
  - **Rojo**: No-show
  - **Gris**: Cancelada

### Cambiar el estado de una cita

En el detalle de la cita (o en la lista):
1. Clic en el menú de estado
2. Opciones disponibles: `Confirmada`, `Completada`, `Cancelada`, `No asistió`
3. Si marcás **"No asistió"**: aparece una alerta preguntando si querés enviar un correo empático al paciente ("Te extrañamos…")

### Agregar notas clínicas privadas

- En el detalle de la cita, encontrás el campo **"Notas privadas"** (ícono de candado)
- Estas notas son **solo para vos**: el paciente nunca las ve
- Hasta 5.000 caracteres por cita

### Crear una cita manual

Para pacientes que contactan por WhatsApp u otros canales:
1. Clic en **"Nueva cita"**
2. Buscá el paciente por nombre o email (debe tener cuenta en el sistema)
3. Seleccioná servicio, modalidad, fecha y hora
4. Clic en **"Crear cita"**

---

## 3. Pacientes (`/admin/pacientes`)

### Buscar un paciente

- Buscá por nombre, email o teléfono en la barra de búsqueda
- La lista muestra nombre, email, teléfono y cantidad total de citas

### Ver la ficha de un paciente

Clic en el nombre del paciente para ver:
- Datos de perfil (nombre, email, teléfono, fecha de registro)
- **Historial completo de citas** con todos los estados
- Podés cambiar el estado de cualquier cita desde la ficha
- Podés ver y editar las notas clínicas de cada cita

---

## 4. Configuración (`/admin/configuracion`)

### Pestaña General

- **Aceptando pacientes nuevos**: Toggle para habilitar/deshabilitar nuevas reservas en el sitio
- **WhatsApp**: número que aparece en el footer y en la web
- **Email de contacto**: el que se muestra en la página de contacto
- **Instrucciones online**: texto que se muestra al paciente cuando elige modalidad virtual

### Pestaña Servicios

- Ver, crear, editar y activar/desactivar tipos de servicio
- Cada servicio tiene: nombre, descripción, duración (minutos), precio (₡)
- Los servicios inactivos no aparecen en el flujo de reserva

### Pestaña Disponibilidad

- Configurar los **horarios semanales recurrentes** (ej: Lunes-Viernes 8am-5pm)
- Para cada día: hora de inicio y hora de fin
- El sistema genera los slots disponibles automáticamente según la duración del servicio

### Pestaña Bloqueos

- **Bloquear fechas específicas** (vacaciones, días festivos, compromisos)
- Ingresá fecha/hora de inicio y fin del bloqueo
- El sistema elimina esos horarios del calendario de reservas automáticamente

---

## 5. Correos que el sistema envía automáticamente

| Evento | Quién lo recibe |
|---|---|
| Paciente se registra | Paciente (bienvenida) |
| Paciente reserva una cita | Paciente (confirmación) + Vos (notificación) |
| Paciente reagenda | Paciente (nueva confirmación) |
| Paciente o admin cancela | Paciente (confirmación de cancelación) |
| 24h antes de la cita | Paciente (recordatorio) |
| Marcás no-show y elegís enviar | Paciente (correo empático "Te extrañamos") |

> Los asuntos de los correos son discretos para proteger la privacidad del paciente en dispositivos compartidos.

---

## 6. Notas importantes

- **Las notas clínicas son privadas**: solo vos las ves. El paciente nunca tiene acceso.
- **Desactivar "aceptando pacientes nuevos"** impide que nuevos pacientes reserven, pero los existentes sí pueden.
- Los **cambios de servicios o configuración** se reflejan en el sitio público en aproximadamente 1 hora (caché).
- Si un paciente te contacta por WhatsApp para cancelar o reagendar, podés hacerlo vos directamente desde el panel.

---

## Flujo típico de un día

1. Entrar a `/admin` y revisar las citas del día
2. A medida que pasan las sesiones, marcar cada cita como **"Completada"**
3. Si alguien no asistió, marcar como **"No asistió"** (y decidir si enviarle el correo)
4. Si alguien te escribe por WhatsApp para reservar, crear la cita manual
5. Revisar `/admin/configuracion` para ajustar horarios si hay cambios en tu agenda
