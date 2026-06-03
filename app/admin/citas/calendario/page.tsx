import { getAppointmentsList } from "@/app/admin/actions";
import { AdminCalendar } from "@/components/admin/admin-calendar";

export default async function CalendarioPage() {
  // Traemos citas del rango actual (mes actual ± buffer)
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const to = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

  const appointments = await getAppointmentsList({ from, to });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Calendario</h1>
      <AdminCalendar appointments={appointments} />
    </div>
  );
}
