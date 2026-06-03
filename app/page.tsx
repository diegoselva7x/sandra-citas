import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getActiveServices, getBookingSettings } from "@/app/booking/actions";
import { Clock, Monitor, MapPin, ArrowRight } from "lucide-react";

function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function HomePage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getBookingSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Psicóloga · Costa Rica
            </div>
            {/* TODO: contenido de Sandra — título principal */}
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Tu bienestar emocional{" "}
              <span className="text-primary">importa</span>
            </h1>
            {/* TODO: contenido de Sandra — subtítulo */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acompañamiento psicológico individual, de pareja y familiar.
              Modalidad presencial y virtual desde la comodidad de tu hogar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/reservar">Reservar mi cita</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sobre-mi">Conocer a Sandra</Link>
              </Button>
            </div>
          </div>

          {/* Placeholder foto de Sandra */}
          <div className="rounded-2xl bg-muted flex items-center justify-center aspect-square max-w-sm mx-auto md:mx-0 w-full">
            <div className="text-center text-muted-foreground space-y-2 p-8">
              <div className="w-16 h-16 rounded-full bg-muted-foreground/20 mx-auto" />
              {/* TODO: contenido de Sandra — foto profesional */}
              <p className="text-sm">Foto de Sandra</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE MÍ BREVE ──────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold">Hola, soy Sandra</h2>
          {/* TODO: contenido de Sandra — presentación breve (2-3 líneas) */}
          <p className="text-muted-foreground leading-relaxed">
            Soy psicóloga con años de experiencia acompañando a personas en su
            proceso de crecimiento personal. Me especializo en terapia
            individual, de pareja y familiar, con un enfoque cálido, empático y
            orientado a resultados concretos.
          </p>
          <Button asChild variant="outline">
            <Link href="/sobre-mi" className="inline-flex items-center gap-2">
              Conocer mi historia <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── SERVICIOS ──────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="bg-muted/40 py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Servicios</h2>
              <p className="text-muted-foreground">
                Elegí el tipo de acompañamiento que mejor se adapte a lo que necesitás.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-sm transition-shadow"
                >
                  <h3 className="font-semibold">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground leading-snug">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration_minutes} min
                    </span>
                    {service.price && (
                      <span className="font-medium text-foreground">
                        {formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/servicios">Ver todos los servicios</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── MODALIDADES ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-semibold text-center">¿Cómo querés atenderte?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6 space-y-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Presencial</h3>
              <p className="text-sm text-muted-foreground">
                {/* TODO: contenido de Sandra — dirección del consultorio */}
                En el consultorio, en un ambiente cómodo y privado.
              </p>
            </div>
            <div className="rounded-xl border p-6 space-y-3">
              <Monitor className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Virtual</h3>
              <p className="text-sm text-muted-foreground">
                Sesión por videollamada. Sandra te envía el enlace por WhatsApp uno o
                dos días antes.
              </p>
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  Escribir por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">¿Listo/a para dar el primer paso?</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Reservar tu cita es fácil y toma menos de un minuto.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/reservar">Reservar ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
