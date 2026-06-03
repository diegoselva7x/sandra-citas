"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { rescheduleAppointment } from "@/app/booking/actions";
import { StepSchedule } from "@/components/booking/step-schedule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  appointmentId: string;
  durationMinutes: number;
  open: boolean;
  onClose: () => void;
}

export function RescheduleDialog({ appointmentId, durationMinutes, open, onClose }: Props) {
  const router = useRouter();
  const [newStartsAt, setNewStartsAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!newStartsAt) return;
    setError(null);
    startTransition(async () => {
      const result = await rescheduleAppointment({
        appointmentId,
        newStartsAt,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        setNewStartsAt(null);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reagendar cita</DialogTitle>
          <DialogDescription>
            Elegí el nuevo día y hora para tu cita.
          </DialogDescription>
        </DialogHeader>

        <StepSchedule
          durationMinutes={durationMinutes}
          selectedSlot={newStartsAt}
          onSelect={setNewStartsAt}
        />

        {error && (
          <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!newStartsAt || isPending}
            className="flex-1"
          >
            {isPending ? "Guardando…" : "Confirmar nuevo horario"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
