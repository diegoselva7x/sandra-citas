// Paso 3: el usuario selecciona una fecha y un horario disponible.
"use client";

import { useState, useEffect, useTransition } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { addDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { getAvailableSlots } from "@/app/booking/actions";
import { TIMEZONE } from "@/lib/types";
import type { AvailabilitySlot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  durationMinutes: number;
  selectedSlot: string | null;
  onSelect: (startsAt: string) => void;
}

const DAYS_VISIBLE = 7;

export function StepSchedule({ durationMinutes, selectedSlot, onSelect }: Props) {
  const tomorrow = startOfDay(addDays(new Date(), 1));

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date>(tomorrow);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isPending, startTransition] = useTransition();

  // Días visibles en la semana actual del offset
  const days = Array.from({ length: DAYS_VISIBLE }, (_, i) =>
    addDays(tomorrow, weekOffset * DAYS_VISIBLE + i),
  );

  // Cuando cambia el día seleccionado, carga los slots
  useEffect(() => {
    setSlots([]);
    startTransition(async () => {
      const dayStr = formatInTimeZone(selectedDay, TIMEZONE, "yyyy-MM-dd");
      const result = await getAvailableSlots(dayStr, dayStr, durationMinutes);
      setSlots(result);
    });
  }, [selectedDay, durationMinutes]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Elegí fecha y hora</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Horarios disponibles en Costa Rica (GMT-6).
        </p>
      </div>

      {/* Selector de semana */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset((w) => w - 1)}
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected =
              formatInTimeZone(day, TIMEZONE, "yyyy-MM-dd") ===
              formatInTimeZone(selectedDay, TIMEZONE, "yyyy-MM-dd");
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "flex flex-col items-center rounded-md py-1.5 px-0.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
              >
                <span className="text-[10px] uppercase tracking-wide leading-none">
                  {formatInTimeZone(day, TIMEZONE, "EEE", { locale: es })}
                </span>
                <span className="text-sm font-medium mt-1">
                  {formatInTimeZone(day, TIMEZONE, "d", { locale: es })}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => setWeekOffset((w) => w + 1)}
          aria-label="Semana siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slots del día seleccionado */}
      <div className="min-h-[120px]">
        {isPending ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Cargando horarios…</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No hay horarios disponibles para este día.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Probá con otro día.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.slot_start}
                type="button"
                onClick={() => onSelect(slot.slot_start)}
                className={cn(
                  "rounded-md border py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedSlot === slot.slot_start
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary hover:bg-accent/50",
                )}
              >
                {formatInTimeZone(new Date(slot.slot_start), TIMEZONE, "h:mm a", { locale: es })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
