// Modal para que Sandra cree una cita manualmente (pacientes por WhatsApp).
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createManualAppointment, getPatients } from "@/app/admin/actions";
import type { ServiceType, AppointmentModality } from "@/lib/types";
import type { PatientWithCount } from "@/app/admin/actions";
import { StepSchedule } from "@/components/booking/step-schedule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  services: ServiceType[];
  open: boolean;
  onClose: () => void;
}

export function ManualAppointmentDialog({ services, open, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"patient" | "schedule" | "confirm">("patient");
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientWithCount[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithCount | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [modality, setModality] = useState<AppointmentModality>("in_person");
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const searchPatients = (q: string) => {
    setSearch(q);
    if (q.length < 2) { setPatients([]); return; }
    startTransition(async () => {
      const results = await getPatients(q);
      setPatients(results);
    });
  };

  const handleConfirm = () => {
    if (!selectedPatient || !startsAt) return;
    setError(null);
    startTransition(async () => {
      const result = await createManualAppointment({
        clientId: selectedPatient.id,
        serviceTypeId: selectedServiceId || undefined,
        startsAt,
        modality,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        resetForm();
        router.refresh();
      }
    });
  };

  const resetForm = () => {
    setStep("patient"); setSearch(""); setPatients([]);
    setSelectedPatient(null); setStartsAt(null); setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); resetForm(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear cita manual</DialogTitle>
        </DialogHeader>

        {step === "patient" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Buscar paciente</Label>
              <Input
                placeholder="Nombre o email…"
                value={search}
                onChange={(e) => searchPatients(e.target.value)}
              />
            </div>
            {patients.length > 0 && (
              <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                {patients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-left px-3 py-2.5 hover:bg-accent text-sm transition-colors"
                    onClick={() => { setSelectedPatient(p); setPatients([]); setSearch(p.full_name); }}
                  >
                    <p className="font-medium">{p.full_name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedPatient && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="service">Servicio</Label>
                  <select
                    id="service"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Modalidad</Label>
                  <div className="flex gap-2">
                    {(["in_person", "online"] as AppointmentModality[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModality(m)}
                        className={`flex-1 rounded-md border py-2 text-sm transition-colors ${modality === m ? "border-primary bg-accent/50" : ""}`}
                      >
                        {m === "in_person" ? "Presencial" : "Virtual"}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={() => setStep("schedule")}>
                  Elegir horario
                </Button>
              </>
            )}
          </div>
        )}

        {step === "schedule" && (
          <div className="space-y-4">
            <StepSchedule
              durationMinutes={selectedService?.duration_minutes ?? 50}
              selectedSlot={startsAt}
              onSelect={setStartsAt}
            />
            {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("patient")} className="flex-1">Volver</Button>
              <Button disabled={!startsAt || isPending} onClick={handleConfirm} className="flex-1">
                {isPending ? "Creando…" : "Confirmar cita"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
