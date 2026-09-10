import { Resend } from "resend";
import { render } from "@react-email/components";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import { WelcomeEmail } from "./templates/welcome";
import { AppointmentConfirmationEmail } from "./templates/appointment-confirmation";
import { CancellationEmail } from "./templates/cancellation";
import { ReminderEmail } from "./templates/reminder";
import { MissedYouEmail } from "./templates/missed-you";
import { AdminNewAppointmentEmail } from "./templates/admin-new-appointment";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Remitente sobre el dominio verificado en Resend. Las respuestas van al Gmail
// que Sandra sí revisa: nadie contesta a una casilla que no existe.
const FROM = "Sandra Carpio · Citas <citas@sandracarpio.com>";
const REPLY_TO = "sandracarpio@gmail.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sandracarpio.com";

/**
 * Envía y verifica el resultado.
 *
 * El SDK de Resend NO lanza excepciones: devuelve `{ data, error }`. Si nadie
 * inspecciona `error`, un 403 por dominio sin verificar es indistinguible de un
 * envío exitoso, y el fallo se vuelve invisible. Por eso todo pasa por acá.
 */
async function enviar({
  to,
  subject,
  html,
  tipo,
}: {
  to: string;
  subject: string;
  html: string;
  tipo: string;
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject,
    html,
  });

  if (error) {
    const detalle = `${error.name} (${error.statusCode ?? "sin código"}): ${error.message}`;
    console.error(`[email] falló "${tipo}" hacia ${to} — ${detalle}`);
    throw new Error(`No se pudo enviar el correo "${tipo}": ${detalle}`);
  }

  console.info(`[email] "${tipo}" enviado a ${to} (id ${data?.id})`);
  return data;
}

function fecha(iso: string): string {
  return formatInTimeZone(
    new Date(iso),
    TIMEZONE,
    "EEEE d 'de' MMMM 'a las' h:mm a",
    { locale: es },
  );
}

async function cargarCita(appointmentId: string) {
  const { data } = await supabaseAdmin
    .from("appointments")
    .select(
      "id, starts_at, modality, status, profiles!appointments_client_id_fkey(full_name, email)",
    )
    .eq("id", appointmentId)
    .single();
  return data as
    | {
        id: string;
        starts_at: string;
        modality: "online" | "in_person";
        status: string;
        profiles: { full_name: string; email: string };
      }
    | null;
}

async function cfg() {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("whatsapp_number, online_instructions, contact_email")
    .eq("id", 1)
    .single();
  return data;
}

/**
 * Ejecuta un envío sin bloquear el flujo principal, pero dejando rastro si falla.
 *
 * Un correo perdido no debe tumbar una reserva; tampoco debe desaparecer en
 * silencio, que es justo lo que hacían los `.catch(() => {})` que esto reemplaza.
 */
export async function sinBloquear(tarea: Promise<unknown>, contexto: string) {
  try {
    await tarea;
  } catch (e) {
    console.error(`[email] ${contexto}:`, e instanceof Error ? e.message : e);
  }
}

// --------- IMPORTANTE: asuntos neutrales, sin la palabra "psicología" ---------
// La gente comparte dispositivos. Nada en el asunto debe delatar el motivo.

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  const settings = await cfg();
  const html = await render(
    React.createElement(WelcomeEmail, {
      name,
      siteUrl: SITE,
      whatsapp: settings?.whatsapp_number,
    }),
  );
  await enviar({ to, subject: "Tu cuenta está lista", html, tipo: "bienvenida" });
}

export async function sendAppointmentConfirmation({
  appointmentId,
  rescheduled = false,
}: {
  appointmentId: string;
  rescheduled?: boolean;
}) {
  const cita = await cargarCita(appointmentId);
  if (!cita) return;
  const settings = await cfg();

  const html = await render(
    React.createElement(AppointmentConfirmationEmail, {
      name: cita.profiles.full_name,
      fecha: fecha(cita.starts_at),
      modality: cita.modality,
      onlineInstructions: settings?.online_instructions,
      rescheduled,
      siteUrl: SITE,
      whatsapp: settings?.whatsapp_number,
    }),
  );

  await enviar({
    to: cita.profiles.email,
    subject: rescheduled ? "Tu cita fue reagendada" : "Confirmación de tu cita",
    html,
    tipo: rescheduled ? "reagendada" : "confirmación de cita",
  });
}

export async function notifyAdminNewAppointment({ appointmentId }: { appointmentId: string }) {
  const cita = await cargarCita(appointmentId);
  if (!cita) return;
  const settings = await cfg();
  if (!settings?.contact_email) return;

  const html = await render(
    React.createElement(AdminNewAppointmentEmail, {
      clientName: cita.profiles.full_name,
      clientEmail: cita.profiles.email,
      fecha: fecha(cita.starts_at),
      modality: cita.modality,
      siteUrl: SITE,
    }),
  );

  await enviar({
    to: settings.contact_email,
    subject: "Nueva cita agendada",
    html,
    tipo: "aviso a Sandra",
  });
}

export async function sendCancellationEmail({ appointmentId }: { appointmentId: string }) {
  const cita = await cargarCita(appointmentId);
  if (!cita) return;
  const settings = await cfg();

  const html = await render(
    React.createElement(CancellationEmail, {
      name: cita.profiles.full_name,
      fecha: fecha(cita.starts_at),
      siteUrl: SITE,
      whatsapp: settings?.whatsapp_number,
    }),
  );

  await enviar({
    to: cita.profiles.email,
    subject: "Tu cita fue cancelada",
    html,
    tipo: "cancelación",
  });
}

export async function sendReminder(cita: {
  starts_at: string;
  modality: "online" | "in_person";
  profiles: { full_name: string; email: string };
}) {
  const settings = await cfg();

  const html = await render(
    React.createElement(ReminderEmail, {
      name: cita.profiles.full_name,
      fecha: fecha(cita.starts_at),
      modality: cita.modality,
      onlineInstructions: settings?.online_instructions,
      siteUrl: SITE,
      whatsapp: settings?.whatsapp_number,
    }),
  );

  await enviar({
    to: cita.profiles.email,
    subject: "Recordatorio de tu cita de mañana",
    html,
    tipo: "recordatorio",
  });
}

export async function sendMissedYouEmail({ appointmentId }: { appointmentId: string }) {
  const cita = await cargarCita(appointmentId);
  if (!cita) return;
  const settings = await cfg();

  const html = await render(
    React.createElement(MissedYouEmail, {
      name: cita.profiles.full_name,
      siteUrl: SITE,
      whatsapp: settings?.whatsapp_number,
    }),
  );

  await enviar({
    to: cita.profiles.email,
    subject: "Te extrañamos en tu sesión",
    html,
    tipo: "te extrañamos",
  });
}
