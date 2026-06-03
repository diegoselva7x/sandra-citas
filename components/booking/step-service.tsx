// Paso 1: el usuario elige el tipo de servicio.
"use client";

import type { ServiceType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  services: ServiceType[];
  selectedId: string | null;
  onSelect: (service: ServiceType) => void;
}

function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price);
}

export function StepService({ services, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">¿Qué tipo de sesión buscás?</h2>
        <p className="text-sm text-muted-foreground mt-1">Elegí el servicio que mejor se adapte a lo que necesitás.</p>
      </div>

      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service)}
            className={cn(
              "w-full text-left rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedId === service.id
                ? "border-primary bg-accent/50 ring-1 ring-primary"
                : "border-border bg-card",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {service.description}
                  </p>
                )}
              </div>
              {service.price && (
                <Badge variant="secondary" className="shrink-0 mt-0.5">
                  {formatPrice(service.price)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{service.duration_minutes} minutos</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
