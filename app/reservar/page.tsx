import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getActiveServices,
  getBookingSettings,
  hasExistingAppointments,
} from "@/app/booking/actions";
import { BookingWizard } from "@/components/booking/booking-wizard";
import Link from "next/link";

export default async function ReservarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [services, settings, hasAppointments] = await Promise.all([
    getActiveServices(),
    getBookingSettings(),
    hasExistingAppointments(),
  ]);

  // Si no hay servicios configurados aún, mostramos un mensaje.
  if (services.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Reservar cita</h1>
        <p className="text-muted-foreground">
          Los servicios aún no están configurados. Volvé más tarde.
        </p>
      </main>
    );
  }

  // Si Sandra cerró el cupo y el usuario es un paciente nuevo, bloquear.
  if (settings && !settings.accepting_new_patients && !hasAppointments) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Reservar cita</h1>
        <p className="text-muted-foreground">
          En este momento no se están aceptando pacientes nuevos.
        </p>
        {settings.whatsapp_number && (
          <p className="text-sm text-muted-foreground">
            Si querés más información podés{" "}
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground"
            >
              escribir por WhatsApp
            </a>
            .
          </p>
        )}
        <Link href="/" className="text-sm underline text-muted-foreground">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Reservar cita</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seguí los pasos para agendar tu sesión con Sandra.
        </p>
      </div>

      <BookingWizard services={services} settings={settings!} />
    </main>
  );
}
