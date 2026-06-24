// Dropdown para cambiar el estado de una cita desde el panel admin.
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "@/app/admin/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { STATUS_LABEL } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

type Status = "confirmed" | "completed" | "no_show" | "cancelled";

interface Props {
  appointmentId: string;
  currentStatus: Status;
}

export function AppointmentStatusMenu({ appointmentId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noShowDialog, setNoShowDialog] = useState(false);

  const handleChange = (status: Status, sendEmail = false) => {
    startTransition(async () => {
      await updateAppointmentStatus(appointmentId, status, sendEmail);
      router.refresh();
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1 focus-visible:outline-none"
            disabled={isPending}
          >
            <StatusBadge status={currentStatus} />
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(["confirmed", "completed", "cancelled"] as Status[]).map((s) => (
            <DropdownMenuItem
              key={s}
              disabled={currentStatus === s}
              onClick={() => handleChange(s)}
            >
              {STATUS_LABEL[s]}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={currentStatus === "no_show"}
            className="text-destructive focus:text-destructive"
            onClick={() => setNoShowDialog(true)}
          >
            No asistió
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog: ofrecer enviar correo "te extrañamos" */}
      <AlertDialog open={noShowDialog} onOpenChange={setNoShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar como «No asistió»</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Querés enviarle un correo empático al paciente invitándolo a reagendar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => { handleChange("no_show", false); setNoShowDialog(false); }}
            >
              Solo marcar
            </Button>
            <Button
              onClick={() => { handleChange("no_show", true); setNoShowDialog(false); }}
            >
              Marcar y enviar correo
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
