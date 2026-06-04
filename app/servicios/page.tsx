import Link from "next/link";
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
    "Conocé los servicios de psicología que ofrece Sandra Carpio en Costa Rica.",
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
