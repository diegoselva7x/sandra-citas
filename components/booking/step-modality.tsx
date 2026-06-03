// Paso 2: el usuario elige presencial o virtual.
"use client";

import type { AppointmentModality } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Monitor } from "lucide-react";

interface Props {
  selected: AppointmentModality | null;
  onlineInstructions: string | null;
  whatsappNumber: string | null;
  onSelect: (modality: AppointmentModality) => void;
}

const options = [
  {
    value: "in_person" as const,
    label: "Presencial",
    description: "Nos vemos en el consultorio.",
    icon: MapPin,
  },
  {
    value: "online" as const,
    label: "Virtual",
    description: "Sesión por videollamada.",
    icon: Monitor,
  },
];

export function StepModality({ selected, onlineInstructions, whatsappNumber, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">¿Cómo preferís la sesión?</h2>
        <p className="text-sm text-muted-foreground mt-1">Podés cambiar esto más adelante.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map(({ value, label, description, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-all hover:border-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected === value
                ? "border-primary bg-accent/50 ring-1 ring-primary"
                : "border-border bg-card",
            )}
          >
            <Icon className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {selected === "online" && (
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm leading-relaxed">
            {onlineInstructions ??
              "Sandra te enviará el enlace de la videollamada por WhatsApp uno o dos días antes de tu cita."}
          </p>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline"
            >
              Escribir por WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
