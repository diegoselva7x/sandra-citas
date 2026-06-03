// Paso 4: resumen de la reserva y confirmación final.
"use client";

import { useState, useTransition } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { bookAppointment } from "@/app/booking/actions";
import { TIMEZONE } from "@/lib/types";
import type { AppointmentModality } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, Clock, MapPin, Monitor } from "lucide-react";

interface Props {
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  modality: AppointmentModality;
  startsAt: string;
  onSuccess: (appointmentId: string) => void;
  onError: () => void;
}

export function StepConfirm({
  serviceId,
  serviceName,
  serviceDuration,
  modality,
  startsAt,
  onSuccess,
  onError,
}: Props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dateLabel = formatInTimeZone(
    new Date(startsAt),
    TIMEZONE,
    "EEEE d 'de' MMMM 'a las' h:mm a",
    { locale: es },
  );

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await bookAppointment({
        serviceTypeId: serviceId,
        startsAt,
        modality,
        clientMessage: message.trim() || undefined,
      });
      if (result.error) {
        setError(result.error);
        if (result.error.includes("disponible")) {
          onError(); // vuelve al selector de horarios
        }
      } else if (result.data?.id) {
        onSuccess(result.data.id);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Confirmá tu cita</h2>
        <p className="text-sm text-muted-foreground mt-1">Revisá los detalles antes de confirmar.</p>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CalendarCheck className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium">{serviceName}</p>
            <p className="text-muted-foreground capitalize">{dateLabel}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
          <p>{serviceDuration} minutos · Hora de Costa Rica (GMT-6)</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {modality === "online" ? (
            <>
              <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />
              <p>Virtual — Sandra te envía el link por WhatsApp</p>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <p>Presencial</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mensaje para Sandra (opcional)</Label>
        <Textarea
          id="message"
          placeholder="¿Hay algo que quieras contarle antes de la sesión?"
          maxLength={500}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
      </div>

      {error && (
        <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">{error}</p>
      )}

      <Button onClick={handleConfirm} disabled={isPending} className="w-full" size="lg">
        {isPending ? "Confirmando…" : "Confirmar cita"}
      </Button>
    </div>
  );
}
