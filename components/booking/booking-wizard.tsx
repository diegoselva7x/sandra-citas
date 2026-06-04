// Orquesta el flujo de 4 pasos para reservar una cita.
"use client";

import { useState } from "react";
import type { ServiceType, Settings, AppointmentModality } from "@/lib/types";
import { StepService } from "./step-service";
import { StepModality } from "./step-modality";
import { StepSchedule } from "./step-schedule";
import { StepConfirm } from "./step-confirm";
import { BookingSuccess } from "./booking-success";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Props {
  services: ServiceType[];
  settings: Settings;
}

type Step = 1 | 2 | 3 | 4 | "success";

interface Selection {
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  modality: AppointmentModality | null;
  startsAt: string | null;
}

const STEP_LABELS: Record<number, string> = {
  1: "Servicio",
  2: "Modalidad",
  3: "Fecha y hora",
  4: "Confirmar",
};

export function BookingWizard({ services, settings }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Selection>({
    serviceId: "",
    serviceName: "",
    serviceDuration: 50,
    modality: null,
    startsAt: null,
  });

  const canGoBack = typeof step === "number" && step > 1;

  const handleBack = () => {
    if (typeof step === "number" && step > 1) {
      setStep((step - 1) as Step);
    }
  };

  if (step === "success" && selection.startsAt) {
    return (
      <BookingSuccess
        startsAt={selection.startsAt}
        modality={selection.modality ?? "in_person"}
        whatsappNumber={settings.whatsapp_number}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      {typeof step === "number" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button
                type="button"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Volver al paso anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <p className="text-xs text-muted-foreground">
              Paso {step} de 4 — {STEP_LABELS[step]}
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={step}
            aria-valuetext={`Paso ${step} de 4 — ${STEP_LABELS[step]}`}
            className="flex gap-1"
          >
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-accent"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pasos */}
      {step === 1 && (
        <StepService
          services={services}
          selectedId={selection.serviceId}
          onSelect={(service) => {
            setSelection((s) => ({
              ...s,
              serviceId: service.id,
              serviceName: service.name,
              serviceDuration: service.duration_minutes,
            }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <>
          <StepModality
            selected={selection.modality}
            onlineInstructions={settings.online_instructions}
            whatsappNumber={settings.whatsapp_number}
            onSelect={(modality) => {
              setSelection((s) => ({ ...s, modality }));
            }}
          />
          <Button
            className="w-full"
            disabled={!selection.modality}
            onClick={() => setStep(3)}
          >
            Continuar
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <StepSchedule
            durationMinutes={selection.serviceDuration}
            selectedSlot={selection.startsAt}
            onSelect={(startsAt) => {
              setSelection((s) => ({ ...s, startsAt }));
            }}
          />
          <Button
            className="w-full"
            disabled={!selection.startsAt}
            onClick={() => setStep(4)}
          >
            Continuar
          </Button>
        </>
      )}

      {step === 4 && selection.startsAt && selection.modality && (
        <StepConfirm
          serviceId={selection.serviceId}
          serviceName={selection.serviceName}
          serviceDuration={selection.serviceDuration}
          modality={selection.modality}
          startsAt={selection.startsAt}
          onSuccess={() => setStep("success")}
          onError={() => {
            // El slot ya fue tomado: volver al selector de horarios
            setSelection((s) => ({ ...s, startsAt: null }));
            setStep(3);
          }}
        />
      )}
    </div>
  );
}
