// Vista lista de citas con filtros, acciones y creación manual.
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import type { AdminAppointment } from "@/app/admin/actions";
import type { ServiceType } from "@/lib/types";
import { AppointmentStatusMenu } from "./appointment-status-menu";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";
import { ManualAppointmentDialog } from "./manual-appointment-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { MODALITY_LABEL } from "@/lib/constants";
import Link from "next/link";
import { Plus, Calendar, CalendarDays } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Completadas" },
  { value: "no_show", label: "No asistió" },
  { value: "cancelled", label: "Canceladas" },
];

interface Props {
  appointments: AdminAppointment[];
  services: ServiceType[];
  filters: { status?: string; from?: string; to?: string; search?: string };
}

export function CitasClient({ appointments, services, filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<AdminAppointment | null>(null);
  const [showManual, setShowManual] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (filters.status && key !== "status") params.set("status", filters.status);
    if (filters.search && key !== "search") params.set("search", filters.search);
    if (filters.from && key !== "from") params.set("from", filters.from);
    if (filters.to && key !== "to") params.set("to", filters.to);
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold tracking-tight">Citas</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/citas/calendario">
              <Calendar className="w-4 h-4 mr-1.5" />
              Ver calendario
            </Link>
          </Button>
          <Button size="sm" onClick={() => setShowManual(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nueva cita
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1 border rounded-md overflow-hidden">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateFilter("status", value === "all" ? "" : value)}
              className={`px-3 py-1.5 text-xs transition-colors ${
                (filters.status ?? "all") === value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Input
          placeholder="Buscar paciente…"
          className="w-48 h-8 text-sm"
          defaultValue={filters.search ?? ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      {/* Lista */}
      {appointments.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No se encontraron citas"
          description="Ajustá los filtros o creá una cita nueva."
        />
      ) : (
        <div className="rounded-lg border divide-y overflow-hidden">
          {appointments.map((appt) => (
            <button
              key={appt.id}
              type="button"
              onClick={() => setSelected(appt)}
              className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <div className="text-sm w-14 shrink-0 text-muted-foreground">
                {formatInTimeZone(new Date(appt.starts_at), TIMEZONE, "d MMM", { locale: es })}
                <br />
                {formatInTimeZone(new Date(appt.starts_at), TIMEZONE, "h:mm a", { locale: es })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {appt.profiles?.full_name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {appt.service_types?.name ?? "Sesión"} · {MODALITY_LABEL[appt.modality]}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <AppointmentStatusMenu
                  appointmentId={appt.id}
                  currentStatus={appt.status}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <AppointmentDetailDialog
        appointment={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />

      <ManualAppointmentDialog
        services={services.filter((s) => s.is_active)}
        open={showManual}
        onClose={() => setShowManual(false)}
      />
    </div>
  );
}
