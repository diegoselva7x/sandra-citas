// Modal con detalles completos de una cita: datos, estado, nota privada.
"use client";

import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import type { AdminAppointment } from "@/app/admin/actions";
import { getAppointmentNote } from "@/app/admin/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AppointmentStatusMenu } from "./appointment-status-menu";
import { AppointmentNote } from "./appointment-note";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  appointment: AdminAppointment | null;
  open: boolean;
  onClose: () => void;
}

export function AppointmentDetailDialog({ appointment, open, onClose }: Props) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (appointment && open) {
      getAppointmentNote(appointment.id).then(setNote);
    }
  }, [appointment?.id, open]);

  if (!appointment) return null;

  const dateLabel = formatInTimeZone(
    new Date(appointment.starts_at),
    TIMEZONE,
    "EEEE d 'de' MMMM 'a las' h:mm a",
    { locale: es },
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de cita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Paciente */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="font-medium">{appointment.profiles?.full_name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{appointment.profiles?.email}</p>
            {appointment.profiles?.phone && (
              <p className="text-sm text-muted-foreground">{appointment.profiles.phone}</p>
            )}
            {appointment.client_id && (
              <Link
                href={`/admin/pacientes/${appointment.client_id}`}
                className="text-xs underline text-primary"
              >
                Ver ficha del paciente
              </Link>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicio</span>
              <span className="font-medium">{appointment.service_types?.name ?? "Sesión"}</span>
            </div>
            <div className="flex justify-between capitalize">
              <span className="text-muted-foreground">Fecha</span>
              <span className="font-medium text-right">{dateLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modalidad</span>
              <span>{appointment.modality === "online" ? "Virtual" : "Presencial"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado</span>
              <AppointmentStatusMenu
                appointmentId={appointment.id}
                currentStatus={appointment.status}
              />
            </div>
          </div>

          {appointment.client_message && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mensaje del paciente</p>
                <p className="text-sm">{appointment.client_message}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Nota privada */}
          <AppointmentNote appointmentId={appointment.id} initialNote={note} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
