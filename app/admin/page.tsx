import { getDashboardData } from "./actions";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import { MODALITY_LABEL } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";

export default async function AdminPage() {
  const { todayCitas, stats } = await getDashboardData();

  const todayLabel = formatInTimeZone(new Date(), TIMEZONE, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight capitalize">{todayLabel}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Bienvenida, Sandra.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/citas">Ver todas las citas</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Citas hoy", value: stats.confirmedToday, icon: Clock },
          { label: "Esta semana", value: stats.totalWeek, icon: CalendarDays },
          { label: "Completadas (semana)", value: stats.completedWeek, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </div>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Citas de hoy */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
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
              <Link
                key={cita.id}
                href="/admin/citas"
                className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div className="text-sm font-medium w-16 shrink-0">
                  {formatInTimeZone(new Date(cita.starts_at), TIMEZONE, "h:mm a", { locale: es })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {cita.profiles?.full_name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {cita.service_types?.name ?? "Sesión"} · {MODALITY_LABEL[cita.modality]}
                  </p>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={cita.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
