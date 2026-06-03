// Pantalla de éxito que se muestra tras confirmar la cita.
"use client";

import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/types";
import type { AppointmentModality } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Props {
  startsAt: string;
  modality: AppointmentModality;
  whatsappNumber: string | null;
}

export function BookingSuccess({ startsAt, modality, whatsappNumber }: Props) {
  const dateLabel = formatInTimeZone(
    new Date(startsAt),
    TIMEZONE,
    "EEEE d 'de' MMMM 'a las' h:mm a",
    { locale: es },
  );

  return (
    <div className="text-center space-y-6 py-4">
      <div className="flex justify-center">
        <CheckCircle className="w-14 h-14 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">¡Tu cita está confirmada!</h2>
        <p className="text-muted-foreground capitalize">{dateLabel}</p>
        <p className="text-sm text-muted-foreground">Hora de Costa Rica (GMT-6)</p>
      </div>

      {modality === "online" && (
        <div className="rounded-lg bg-muted p-4 text-sm text-left space-y-2">
          <p className="font-medium">Cita virtual</p>
          <p className="text-muted-foreground">
            Sandra te enviará el enlace de la videollamada por WhatsApp uno o dos días antes.
          </p>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-primary underline font-medium"
            >
              Escribir por WhatsApp
            </a>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Te enviamos la confirmación a tu correo.
      </p>

      <div className="flex flex-col gap-3">
        <Button asChild>
          <Link href="/mi-cuenta">Ver mis citas</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/reservar">Reservar otra cita</Link>
        </Button>
      </div>
    </div>
  );
}
