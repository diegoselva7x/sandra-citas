import { getAppointmentsList, getAllServiceTypes } from "@/app/admin/actions";
import { CitasClient } from "@/components/admin/citas-client";

export default async function AdminCitasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [appointments, services] = await Promise.all([
    getAppointmentsList({
      status: params.status,
      from: params.from,
      to: params.to,
      search: params.search,
    }),
    getAllServiceTypes(),
  ]);

  return <CitasClient appointments={appointments} services={services} filters={params} />;
}
