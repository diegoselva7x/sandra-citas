// Editor de nota privada por cita. Solo visible para el admin.
"use client";

import { useState, useTransition } from "react";
import { saveAppointmentNote } from "@/app/admin/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/success-message";
import { Lock } from "lucide-react";

interface Props {
  appointmentId: string;
  initialNote: string;
}

export function AppointmentNote({ appointmentId, initialNote }: Props) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveAppointmentNote(appointmentId, note);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        <span>Nota privada (solo vos la ves)</span>
      </div>
      <Textarea
        value={note}
        onChange={(e) => { setNote(e.target.value); setSaved(false); }}
        placeholder="Anotaciones clínicas, seguimiento, recordatorios…"
        rows={4}
        className="text-sm"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {saved && <SuccessMessage className="text-xs">Nota guardada.</SuccessMessage>}
      <Button size="sm" variant="outline" onClick={handleSave} disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar nota"}
      </Button>
    </div>
  );
}
