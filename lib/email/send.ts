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

// DEMO: usa onboarding@resend.dev (solo llega al email del dueño de la cuenta Resend).
// PRODUCCIÓN: cambiar a "Sandra · Citas <citas@psicologasandra.com>" tras verificar dominio en Resend.
const FROM = "Sandra · Citas <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  await resend.emails.send({ from: FROM, to, subject: "Tu cuenta está lista", html });
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

  await resend.emails.send({
    from: FROM,
    to: cita.profiles.email,
    subject: rescheduled ? "Tu cita fue reagendada" : "Confirmación de tu cita",
    html,
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

  await resend.emails.send({
    from: FROM,
    to: settings.contact_email,
    subject: "Nueva cita agendada",
    html,
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

  await resend.emails.send({
    from: FROM,
    to: cita.profiles.email,
    subject: "Tu cita fue cancelada",
    html,
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

  await resend.emails.send({
    from: FROM,
    to: cita.profiles.email,
    subject: "Recordatorio de tu cita de mañana",
    html,
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

  await resend.emails.send({
    from: FROM,
    to: cita.profiles.email,
    subject: "Te extrañamos en tu sesión",
    html,
  });
}
