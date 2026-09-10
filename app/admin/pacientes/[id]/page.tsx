import { getPatientDetail, getAppointmentNote } from "@/app/admin/actions";
import { notFound } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import { AppointmentNote } from "@/components/admin/appointment-note";
import { EmptyState } from "@/components/ui/empty-state";
import { MODALITY_LABEL } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { AppointmentStatusMenu } from "@/components/admin/appointment-status-menu";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, appointments } = await getPatientDetail(id);
  if (!profile) notFound();

  // Cargar notas de todas las citas en paralelo
  const notes = await Promise.all(
    appointments.map((a) => getAppointmentNote(a.id)),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link
        href="/admin/pacientes"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a pacientes
      </Link>

      {/* Datos del paciente */}
      <div className="rounded-lg border bg-card p-4 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{profile.full_name}</h1>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
        <p className="text-xs text-muted-foreground">
          Registrado el{" "}
          {formatInTimeZone(new Date(profile.created_at), TIMEZONE, "d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Historial de citas */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Historial de citas ({appointments.length})
        </h2>
        {appointments.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Sin citas registradas" />
        ) : (
          <div className="space-y-4">
            {appointments.map((appt, i) => (
              <div key={appt.id} className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm capitalize">
                      {formatInTimeZone(
                        new Date(appt.starts_at),
                        TIMEZONE,
                        "EEEE d 'de' MMMM 'a las' h:mm a",
                        { locale: es },
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {appt.service_types?.name ?? "Sesión"} · {MODALITY_LABEL[appt.modality]}
                    </p>
                  </div>
                  <AppointmentStatusMenu
                    appointmentId={appt.id}
                    currentStatus={appt.status}
                  />
                </div>

                {appt.client_message && (
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    Mensaje: {appt.client_message}
                  </p>
                )}

                <div className="border-t pt-3">
                  <AppointmentNote
                    appointmentId={appt.id}
                    initialNote={notes[i] ?? ""}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
