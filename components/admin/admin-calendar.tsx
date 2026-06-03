// Vista de calendario: mini calendario mensual + vista grande react-big-calendar.
"use client";

import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { formatInTimeZone } from "date-fns-tz";
import { format as fnsFormat, parse as fnsParse, startOfWeek, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import type { AdminAppointment } from "@/app/admin/actions";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";
import { Calendar as MiniCalendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string, culture?: string) =>
    fnsFormat(date, formatStr, { locale: culture === "es" ? es : undefined }),
  parse: (value: string, formatStr: string) =>
    fnsParse(value, formatStr, new Date()),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

const STATUS_COLOR: Record<string, string> = {
  confirmed: "#2563eb",
  completed: "#16a34a",
  no_show:   "#dc2626",
  cancelled: "#9ca3af",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmada",
  completed: "Completada",
  no_show:   "No asistió",
  cancelled: "Cancelada",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  no_show:   "destructive",
  cancelled: "outline",
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AdminAppointment;
}

interface Props {
  appointments: AdminAppointment[];
}

export function AdminCalendar({ appointments }: Props) {
  const [selectedAppt, setSelectedAppt] = useState<AdminAppointment | null>(null);

  const initialDate = useMemo(() => {
    const upcoming = appointments.find(
      (a) => a.status !== "cancelled" && new Date(a.starts_at) >= new Date(),
    );
    return upcoming ? new Date(upcoming.starts_at) : new Date();
  }, [appointments]);

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [currentView, setCurrentView] = useState<(typeof Views)[keyof typeof Views]>(Views.WEEK);

  const daysWithAppointments = useMemo(
    () => appointments.filter((a) => a.status !== "cancelled").map((a) => new Date(a.starts_at)),
    [appointments],
  );

  const handleMiniCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    setCurrentDate(date);
    setCurrentView(Views.DAY);
  };

  const events = useMemo<CalendarEvent[]>(
    () =>
      appointments.map((appt) => ({
        id: appt.id,
        title: appt.profiles?.full_name ?? "Paciente",
        start: new Date(appt.starts_at),
        end: new Date(appt.ends_at),
        resource: appt,
      })),
    [appointments],
  );

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: STATUS_COLOR[event.resource.status] ?? "#2563eb",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      padding: "1px 4px",
    },
  });

  // Citas del día seleccionado (para la vista mobile)
  const selectedDayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => isSameDay(new Date(a.starts_at), currentDate))
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [appointments, currentDate],
  );

  const selectedDayLabel = formatInTimeZone(currentDate, TIMEZONE, "EEEE d 'de' MMMM", { locale: es });

  return (
    <>
      {/* ── Mobile (< md) ── */}
      <div className="md:hidden space-y-4">
        <MiniCalendar
          mode="single"
          selected={currentDate}
          onSelect={(d) => d && setCurrentDate(d)}
          locale={es}
          modifiers={{ hasAppointment: daysWithAppointments }}
          modifiersClassNames={{ hasAppointment: "has-appointment" }}
          className="rounded-lg border bg-card w-full"
        />

        <div>
          <p className="text-sm font-medium capitalize mb-2">{selectedDayLabel}</p>
          {selectedDayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg">
              No hay citas este día.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDayAppointments.map((appt) => (
                <button
                  key={appt.id}
                  onClick={() => setSelectedAppt(appt)}
                  className="w-full text-left rounded-lg border bg-card p-3 space-y-1 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {appt.profiles?.full_name ?? "Paciente"}
                    </span>
                    <Badge variant={STATUS_VARIANT[appt.status]}>
                      {STATUS_LABEL[appt.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatInTimeZone(new Date(appt.starts_at), TIMEZONE, "h:mm a")}
                    {" – "}
                    {formatInTimeZone(new Date(appt.ends_at), TIMEZONE, "h:mm a")}
                    {" · "}
                    {appt.service_types?.name ?? "Sesión"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {[
            { color: "#2563eb", label: "Confirmada" },
            { color: "#16a34a", label: "Completada" },
            { color: "#dc2626", label: "No asistió" },
            { color: "#9ca3af", label: "Cancelada" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop (md+) ── */}
      <div className="hidden md:flex gap-6 items-start">
        <div className="shrink-0">
          <MiniCalendar
            mode="single"
            selected={currentDate}
            onSelect={handleMiniCalendarSelect}
            locale={es}
            modifiers={{ hasAppointment: daysWithAppointments }}
            modifiersClassNames={{ hasAppointment: "has-appointment" }}
            className="rounded-lg border bg-card p-0"
          />
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground px-1">
            {[
              { color: "#2563eb", label: "Confirmada" },
              { color: "#16a34a", label: "Completada" },
              { color: "#dc2626", label: "No asistió" },
              { color: "#9ca3af", label: "Cancelada" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0" style={{ height: "calc(100vh - 12rem)" }}>
          <Calendar
            localizer={localizer}
            events={events}
            date={currentDate}
            view={currentView}
            onNavigate={(date) => setCurrentDate(date)}
            onView={(view) => setCurrentView(view)}
            views={[Views.WEEK, Views.MONTH, Views.DAY]}
            culture="es"
            messages={{
              week: "Semana",
              month: "Mes",
              day: "Día",
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              noEventsInRange: "No hay citas en este período.",
            }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event: CalendarEvent) => setSelectedAppt(event.resource)}
            style={{ fontFamily: "inherit" }}
          />
        </div>
      </div>

      <AppointmentDetailDialog
        appointment={selectedAppt}
        open={!!selectedAppt}
        onClose={() => setSelectedAppt(null)}
      />
    </>
  );
}
