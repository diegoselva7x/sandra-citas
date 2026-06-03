"use client";

import { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import type { AppointmentWithService } from "@/app/mi-cuenta/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelDialog } from "./cancel-dialog";
import { RescheduleDialog } from "./reschedule-dialog";
import { CalendarDays, Clock, MapPin, Monitor } from "lucide-react";

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

interface Props {
  appointment: AppointmentWithService;
  upcoming: boolean;
}

export function AppointmentCard({ appointment, upcoming }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const dateLabel = formatInTimeZone(
    new Date(appointment.starts_at),
    TIMEZONE,
    "EEEE d 'de' MMMM 'a las' h:mm a",
    { locale: es },
  );

  const duration = appointment.service_types?.duration_minutes ?? 50;

  return (
    <>
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium leading-tight">
            {appointment.service_types?.name ?? "Sesión"}
          </p>
          <Badge variant={STATUS_VARIANT[appointment.status]}>
            {STATUS_LABEL[appointment.status]}
          </Badge>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span className="capitalize">{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{duration} minutos · Hora de Costa Rica (GMT-6)</span>
          </div>
          <div className="flex items-center gap-2">
            {appointment.modality === "online" ? (
              <><Monitor className="w-4 h-4 shrink-0" /><span>Virtual</span></>
            ) : (
              <><MapPin className="w-4 h-4 shrink-0" /><span>Presencial</span></>
            )}
          </div>
        </div>

        {appointment.cancellation_reason && (
          <p className="text-xs text-muted-foreground border-t pt-2">
            Motivo: {appointment.cancellation_reason}
          </p>
        )}

        {upcoming && appointment.status === "confirmed" && (
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setRescheduleOpen(true)}
            >
              Reagendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <CancelDialog
        appointmentId={appointment.id}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
      <RescheduleDialog
        appointmentId={appointment.id}
        durationMinutes={duration}
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
      />
    </>
  );
}
