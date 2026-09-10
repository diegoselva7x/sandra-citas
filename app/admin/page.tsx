import { getDashboardData, type AdminAppointment } from "./actions";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import { MODALITY_LABEL } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";

/** Una fila de cita. Se muestra el día sólo en la lista de lo que viene. */
function FilaCita({ cita, conDia = false }: { cita: AdminAppointment; conDia?: boolean }) {
  return (
    <Link
      href="/admin/citas"
      className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3.5 transition-colors hover:bg-accent/50"
    >
      <div className="w-28 shrink-0 font-medium">
        {conDia && (
          <span className="block text-xs capitalize text-muted-foreground">
            {formatInTimeZone(new Date(cita.starts_at), TIMEZONE, "EEE d MMM", { locale: es })}
          </span>
        )}
        {formatInTimeZone(new Date(cita.starts_at), TIMEZONE, "h:mm a", { locale: es })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{cita.profiles?.full_name ?? "—"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {cita.service_types?.name ?? "Sesión"} · {MODALITY_LABEL[cita.modality]}
        </p>
      </div>
      <div className="shrink-0">
        <StatusBadge status={cita.status} />
      </div>
    </Link>
  );
}

export default async function AdminPage() {
  const { todayCitas, proximasCitas, stats } = await getDashboardData();

  const todayLabel = formatInTimeZone(new Date(), TIMEZONE, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize tracking-tight">{todayLabel}</h1>
          <p className="mt-0.5 text-muted-foreground">Bienvenida, Sandra.</p>
        </div>
        <Button asChild>
          <Link href="/admin/citas">Ver todas las citas</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Citas hoy", value: stats.confirmedToday, icon: Clock },
          { label: "Esta semana", value: stats.totalWeek, icon: CalendarDays },
          { label: "Completadas (semana)", value: stats.completedWeek, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-card p-5">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </div>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Hoy y lo que viene, lado a lado en pantallas anchas */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold uppercase tracking-wide text-muted-foreground">
            Citas de hoy
          </h2>
          {todayCitas.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No hay citas para hoy"
              description="Tu agenda de hoy está libre."
            />
          ) : (
            <div className="space-y-2">
              {todayCitas.map((cita) => (
                <FilaCita key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-semibold uppercase tracking-wide text-muted-foreground">
            Próximas citas
          </h2>
          {proximasCitas.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No hay citas próximas"
              description="Cuando alguien reserve, aparece acá."
            />
          ) : (
            <div className="space-y-2">
              {proximasCitas.map((cita) => (
                <FilaCita key={cita.id} cita={cita} conDia />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
