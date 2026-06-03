import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getActiveServices, getBookingSettings } from "@/app/booking/actions";
import { Clock, Monitor, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios · Sandra Carpio Psicóloga",
  description: "Conocé los servicios de psicología que ofrece Sandra Carpio en Costa Rica.",
};

function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ServiciosPage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getBookingSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-semibold">Servicios</h1>
          <p className="text-muted-foreground leading-relaxed">
            Pendiente
          </p>
        </div>
      </section>

      {/* Lista de servicios */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {services.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Los servicios están siendo actualizados. Volvé pronto.
            </p>
          ) : (
            <div className="grid gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border bg-card p-6 grid sm:grid-cols-[1fr_auto] gap-4 items-start"
                >
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{service.name}</h2>
                    {service.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {service.duration_minutes} minutos
                      </span>
                      {service.price && (
                        <span className="font-semibold text-foreground">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" className="shrink-0">
                    <Link href="/reservar">Reservar</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modalidades */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-semibold text-center">Modalidades de atención</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card border p-6 space-y-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Presencial</h3>
              <p className="text-sm text-muted-foreground">
                Pendiente
              </p>
            </div>
            <div className="rounded-xl bg-card border p-6 space-y-3">
              <Monitor className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Virtual</h3>
              <p className="text-sm text-muted-foreground">
                {settings?.online_instructions ??
                  "Sesión por videollamada. Sandra te envía el enlace por WhatsApp uno o dos días antes de tu cita."}
              </p>
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  Consultar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">¿Tenés dudas sobre qué servicio elegir?</h2>
          <p className="text-sm text-muted-foreground">
            La primera consulta es el punto de partida ideal. Juntos definimos el mejor camino.
          </p>
          <Button asChild size="lg">
            <Link href="/reservar">Reservar primera consulta</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
