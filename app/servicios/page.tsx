import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getActiveServices } from "@/app/booking/actions";
import { formatPrice } from "@/lib/constants";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Servicios de psicología y psicoterapia de Sandra Carpio en Costa Rica: terapia individual, de pareja y familiar, con enfoque integrativo y abordaje del trauma (EMDR). Presencial y virtual.",
  alternates: { canonical: "/servicios" },
};

export default async function ServiciosPage() {
  const services = await getActiveServices();

  return (
    <main className="flex flex-col">
      <PageHeader
        title="Servicios"
        subtitle="Elegí el tipo de acompañamiento que mejor se adapte a lo que necesitás."
      />

      {/* Intro con foto de sesión */}
      <Section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <ScrollReveal className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-accent shadow-sm">
              <Image
                src="/sandra-sesion.jpg"
                alt="Sesión de psicoterapia con Sandra Carpio en su consultorio"
                fill
                priority
                sizes="(min-width: 768px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Acompañamiento a tu medida
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cada proceso es distinto. Trabajo desde un enfoque integrativo,
              combinando herramientas respaldadas por la evidencia y adaptándolas
              a lo que vos necesitás, con especial formación en el abordaje del
              trauma y certificación en EMDR.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Podés elegir la modalidad que más te convenga: sesiones
              presenciales en consultorio o virtuales desde donde estés.
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* Lista de servicios */}
      <Section>
        <div className="max-w-4xl mx-auto space-y-8">
          {services.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Los servicios están siendo actualizados. Volvé pronto.
            </p>
          ) : (
            <div className="grid gap-6">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={i * 60}>
                  <article className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-[1fr_auto] gap-4 items-start hover:border-primary/30 hover:shadow-md transition-all duration-200">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-foreground">
                        {service.name}
                      </h2>
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
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cream">
        <ScrollReveal className="max-w-md mx-auto space-y-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            ¿Tenés dudas sobre qué servicio elegir?
          </h2>
          <p className="text-muted-foreground">
            La primera consulta es el punto de partida ideal. Juntos definimos
            el mejor camino.
          </p>
          <Button asChild variant="glass" size="lg" className="text-base px-8 py-5 h-auto">
            <Link href="/reservar">Reservar primera consulta</Link>
          </Button>
        </ScrollReveal>
      </Section>
    </main>
  );
}
