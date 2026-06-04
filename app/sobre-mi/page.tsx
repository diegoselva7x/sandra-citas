import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h — contenido estático

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Conocé la historia, formación y enfoque de Sandra Carpio, psicóloga en Costa Rica.",
  alternates: { canonical: "/sobre-mi" },
};

const FORMACION = [
  "Pendiente",
  "Pendiente",
  "Pendiente",
  "Pendiente",
];

export default function SobreMiPage() {
  return (
    <main className="flex flex-col">
      <PageHeader
        title="Sandra Carpio"
        subtitle="Psicóloga clínica · Colegiada"
      />

      {/* Presentación con foto */}
      <Section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden bg-accent shadow-sm">
              <Image
                src="/sandra-principal.png"
                alt="Sandra Carpio, psicóloga"
                fill
                priority
                sizes="(min-width: 768px) 20rem, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Te acompaño en tu proceso
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {/* TODO: contenido de Sandra — presentación breve */}
              Pendiente
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* Mi historia */}
      <Section variant="cream">
        <ScrollReveal className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Mi historia
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {/* TODO: contenido de Sandra — bio completa */}
            <p>Pendiente</p>
          </div>
        </ScrollReveal>
      </Section>

      {/* Formación y credenciales */}
      <Section>
        <ScrollReveal className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Formación y credenciales
          </h2>
          <ul className="space-y-4">
            {FORMACION.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </Section>

      {/* Mi enfoque terapéutico */}
      <Section variant="cream">
        <ScrollReveal className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Mi enfoque terapéutico
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {/* TODO: contenido de Sandra — enfoque terapéutico */}
            Pendiente
          </p>
        </ScrollReveal>
      </Section>

      {/* CTA */}
      <Section>
        <ScrollReveal className="max-w-md mx-auto space-y-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            ¿Querés conocernos mejor?
          </h2>
          <p className="text-muted-foreground">
            La primera sesión es el mejor lugar para empezar.
          </p>
          <Button asChild variant="glass" size="lg" className="text-base px-8 py-5 h-auto">
            <Link href="/reservar">Reservar mi primera cita</Link>
          </Button>
        </ScrollReveal>
      </Section>
    </main>
  );
}
