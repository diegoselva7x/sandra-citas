import { getBookingSettings } from "@/app/booking/actions";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import ContactForm from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto · Sandra Mora Psicóloga",
  description: "Contactá a Sandra Mora por email, WhatsApp o el formulario de contacto.",
};

export default async function ContactoPage() {
  const settings = await getBookingSettings();

  const waNumber = settings?.whatsapp_number?.replace(/\D/g, "") ?? null;
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-semibold">Contacto</h1>
          <p className="text-muted-foreground leading-relaxed">
            ¿Tenés preguntas o querés coordinar algo antes de reservar? Estoy
            disponible por WhatsApp, email o el formulario de abajo.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Info de contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Información de contacto</h2>
              <ul className="space-y-5">

                {waUrl && (
                  <li className="flex items-start gap-4">
                    <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline"
                      >
                        {settings?.whatsapp_number}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Respondo en horario de atención
                      </p>
                    </div>
                  </li>
                )}

                {settings?.contact_email && (
                  <li className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-sm text-primary underline"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </li>
                )}

                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Consultorio</p>
                    {/* TODO: contenido de Sandra — dirección del consultorio */}
                    <p className="text-sm text-muted-foreground">
                      [TODO: dirección del consultorio]
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Horario de atención</p>
                    {/* TODO: contenido de Sandra — horario */}
                    <p className="text-sm text-muted-foreground">
                      [TODO: horario de atención]
                    </p>
                  </div>
                </li>

              </ul>
            </div>

            {waUrl && (
              <div className="rounded-xl border bg-card p-5 space-y-3">
                <p className="text-sm font-medium">¿Preferís escribir directo?</p>
                <p className="text-sm text-muted-foreground">
                  Si tenés una consulta rápida, WhatsApp suele ser la forma más ágil.
                </p>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Escribir por WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Enviame un mensaje</h2>
            <ContactForm contactEmail={settings?.contact_email ?? null} />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">¿Listo/a para reservar?</h2>
          <p className="text-sm text-muted-foreground">
            Podés reservar tu cita directamente desde la web, sin necesidad de llamar.
          </p>
          <Button asChild size="lg">
            <a href="/reservar">Reservar mi cita</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
