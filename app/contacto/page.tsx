import Link from "next/link";
import { getBookingSettings } from "@/app/booking/actions";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { LocationMap } from "@/components/location-map";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { waLink } from "@/lib/constants";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import ContactForm from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a Sandra Carpio por email, WhatsApp o el formulario de contacto.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const settings = await getBookingSettings();

  const waUrl = waLink(
    settings?.whatsapp_number,
    "Hola Sandra, me gustaría hacerte una consulta.",
  );
  const hasMap = settings?.latitude != null && settings?.longitude != null;

  return (
    <main className="flex flex-col">
      <BreadcrumbJsonLd items={[{ name: "Contacto", path: "/contacto" }]} />
      <PageHeader
        title="Contacto"
        subtitle="¿Tenés preguntas o querés coordinar algo antes de reservar? Estoy disponible por WhatsApp, email o el formulario de abajo."
      />

      {/* Contenido principal */}
      <Section>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Info de contacto */}
          <ScrollReveal className="space-y-8">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                Información de contacto
              </h2>
              <ul className="space-y-5">
                {waUrl && (
                  <li className="flex items-start gap-4">
                    <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">WhatsApp</p>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors"
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
                      <p className="font-medium text-foreground">Email</p>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-sm text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </li>
                )}

                {settings?.instagram_url && (
                  <li className="flex items-start gap-4">
                    <InstagramIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Instagram</p>
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors"
                      >
                        @sandcarpio
                      </a>
                    </div>
                  </li>
                )}

                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Consultorio</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.address ?? "Cartago, Provincia de Cartago, Costa Rica"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Horario de atención</p>
                    <p className="text-sm text-muted-foreground">
                      Atención con cita previa. Reservá tu horario disponible
                      en línea.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {(waUrl || settings?.instagram_url) && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  ¿Preferís escribir directo?
                </p>
                <p className="text-sm text-muted-foreground">
                  Para una consulta rápida, WhatsApp suele ser lo más ágil. También
                  podés seguirme en Instagram.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {waUrl && (
                    <Button asChild variant="glass" className="w-full sm:w-auto">
                      <a href={waUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Escribir por WhatsApp
                      </a>
                    </Button>
                  )}
                  {settings?.instagram_url && (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                        <InstagramIcon className="w-4 h-4 mr-2" />
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>

          {/* Formulario */}
          <ScrollReveal delay={100}>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
              Enviame un mensaje
            </h2>
            <ContactForm contactEmail={settings?.contact_email ?? null} />
          </ScrollReveal>
        </div>

        {/* Mapa del consultorio */}
        {hasMap && (
          <ScrollReveal
            id="ubicacion"
            className="max-w-2xl mx-auto mt-14 space-y-5 scroll-mt-24"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Dónde estoy
            </h2>
            <LocationMap
              latitude={settings!.latitude!}
              longitude={settings!.longitude!}
              mapsUrl={settings!.maps_url}
              address={settings!.address ?? "Cartago, Provincia de Cartago, Costa Rica"}
            />
          </ScrollReveal>
        )}
      </Section>

      {/* CTA */}
      <Section variant="cream">
        <ScrollReveal className="max-w-md mx-auto space-y-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            ¿Listo/a para reservar?
          </h2>
          <p className="text-muted-foreground">
            Podés reservar tu cita directamente desde la web, sin necesidad de llamar.
          </p>
          <Button asChild variant="glass" size="lg" className="text-base px-8 py-5 h-auto">
            <Link href="/reservar">Reservar mi cita</Link>
          </Button>
        </ScrollReveal>
      </Section>
    </main>
  );
}
