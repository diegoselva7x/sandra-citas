import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/lib/types";

export const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmada",
  completed: "Completada",
  no_show: "No asistió",
  cancelled: "Cancelada",
};

export const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "default",
  completed: "secondary",
  no_show: "destructive",
  cancelled: "outline",
};

interface StatusBadgeProps {
  status: AppointmentStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
