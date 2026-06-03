import { getPatientDetail, getAppointmentNote } from "@/app/admin/actions";
import { notFound } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AppointmentNote } from "@/components/admin/appointment-note";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppointmentStatusMenu } from "@/components/admin/appointment-status-menu";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmada",
  completed: "Completada",
  no_show: "No asistió",
  cancelled: "Cancelada",
};
const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  no_show: "destructive",
  cancelled: "outline",
};

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
    <div className="p-6 max-w-3xl space-y-6">
      <Link
        href="/admin/pacientes"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a pacientes
      </Link>

      {/* Datos del paciente */}
      <div className="rounded-lg border bg-card p-4 space-y-1">
        <h1 className="text-xl font-semibold">{profile.full_name}</h1>
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
          <p className="text-sm text-muted-foreground">Sin citas.</p>
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
                      {appt.service_types?.name ?? "Sesión"} ·{" "}
                      {appt.modality === "online" ? "Virtual" : "Presencial"}
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
