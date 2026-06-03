// Vista de calendario: mini calendario mensual + vista grande react-big-calendar.
"use client";

import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { AdminAppointment } from "@/app/admin/actions";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";
import { Calendar as MiniCalendar } from "@/components/ui/calendar";

// date-fns v4: el tercer argumento que pasa react-big-calendar es un string de cultura,
// pero date-fns espera un objeto options → hay que envolverlo manualmente.
const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string, culture?: string) =>
    format(date, formatStr, { locale: culture === "es" ? es : undefined }),
  parse: (value: string, formatStr: string, locale?: string) =>
    parse(value, formatStr, new Date(), { locale: locale === "es" ? es : undefined }),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

const STATUS_COLOR: Record<string, string> = {
  confirmed: "#2563eb",
  completed: "#16a34a",
  no_show: "#dc2626",
  cancelled: "#9ca3af",
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

  // Estado controlado: necesario para que Hoy/Anterior/Siguiente/vistas funcionen
  const initialDate = useMemo(() => {
    const upcoming = appointments.find(
      (a) => a.status !== "cancelled" && new Date(a.starts_at) >= new Date(),
    );
    return upcoming ? new Date(upcoming.starts_at) : new Date();
  }, [appointments]);

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [currentView, setCurrentView] = useState<(typeof Views)[keyof typeof Views]>(Views.WEEK);

  // Días que tienen al menos una cita (para mostrar puntos en el mini calendario)
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

  return (
    <>
      <div className="flex gap-6 items-start">
        {/* Mini calendario */}
        <div className="shrink-0">
          <MiniCalendar
            mode="single"
            selected={currentDate}
            onSelect={handleMiniCalendarSelect}
            locale={es}
            modifiers={{ hasAppointment: daysWithAppointments }}
            modifiersClassNames={{
              hasAppointment: "has-appointment",
            }}
            className="rounded-lg border bg-card p-0"
          />
          {/* Leyenda */}
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

        {/* Calendario grande */}
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
