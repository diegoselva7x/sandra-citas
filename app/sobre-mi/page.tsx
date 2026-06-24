import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BLUR } from "@/lib/image-blur";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h — contenido estático

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Sandra Carpio Monge, psicóloga y psicoterapeuta en Costa Rica. Enfoque integrativo con especial formación en trauma y certificación en EMDR. Acompañamiento en ansiedad, trauma y crecimiento personal.",
  alternates: { canonical: "/sobre-mi" },
};

// Formación académica
const FORMACION_ACADEMICA = [
  "Bachillerato en Psicología",
  "Licenciatura en Psicología — Universidad Católica de Costa Rica",
  "Maestría en Psicología Clínica",
];

// Certificaciones y formación especializada
const CERTIFICACIONES = [
  "Especialista en Terapia EMDR (certificada)",
  "Entrenamiento básico en EMDR (Eye Movement Desensitization and Reprocessing)",
  "Protocolos R-TEP y G-TEP",
  "Terapia Dialéctica Comportamental (DBT) — The Linehan Institute · DBT Iberoamérica",
  "Deep Brain Reorienting (DBR) — Reorientación Cerebral Profunda",
  "Terapia Focalizada en las Emociones (EFT) — Externship",
  "Hipnosis Clínica (UNIBE)",
];

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicologasandra.com";

export default function SobreMiPage() {
  // JSON-LD: ProfilePage + Person (mismo @id que la home) con credenciales → E-E-A-T
  const profileLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE}/#sandra`,
      name: "Sandra Carpio Monge",
      jobTitle: "Psicóloga y psicoterapeuta",
      url: `${SITE}/sobre-mi`,
      image: `${SITE}/sandra-principal.jpg`,
      description:
        "Psicóloga y psicoterapeuta con enfoque integrativo, especialista en EMDR y abordaje del trauma, en Costa Rica.",
      knowsAbout: [
        "Psicoterapia",
        "EMDR",
        "Trauma",
        "Ansiedad",
        "Terapia de pareja",
        "Terapia familiar",
        "Terapia Dialéctica Comportamental (DBT)",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universidad Católica de Costa Rica",
      },
      hasCredential: CERTIFICACIONES.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c,
      })),
      sameAs: ["https://www.instagram.com/sandcarpio"],
    },
  };

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Sobre mí", path: "/sobre-mi" }]} />
      <PageHeader
        title="Sandra Carpio Monge"
        subtitle="Psicóloga y psicoterapeuta · Especialista en EMDR · Enfoque integrativo"
      />

      {/* Presentación con foto */}
      <Section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden bg-accent shadow-sm">
              <Image
                src="/sandra-principal.jpg"
                alt="Sandra Carpio Monge, psicóloga y psicoterapeuta"
                fill
                priority
                placeholder="blur"
                blurDataURL={BLUR.principal}
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
              Soy psicóloga y psicoterapeuta con un enfoque integrativo,
              orientado a comprender a cada persona de manera individual y a
              adaptar las intervenciones a sus necesidades específicas. Mi
              práctica clínica incorpora aportes de distintos modelos
              terapéuticos respaldados por la evidencia, con especial formación
              en trauma y certificación en EMDR.
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
            <p>
              A lo largo de mi trayectoria profesional he acompañado a personas
              que enfrentan ansiedad, experiencias traumáticas, dificultades
              emocionales y procesos de crecimiento personal.
            </p>
            <p>
              Mi trabajo se fundamenta en la creación de un espacio seguro,
              respetuoso y colaborativo, donde cada persona pueda desarrollar
              recursos para afrontar sus desafíos y promover un mayor bienestar
              emocional.
            </p>
            <p>
              Concibo la terapia como un proceso de acompañamiento que integra
              la comprensión de la historia personal, los recursos presentes y
              el potencial de cambio de cada individuo.
            </p>
          </div>
        </ScrollReveal>
      </Section>

      {/* Mi enfoque terapéutico — con foto de sesión */}
      <Section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal delay={100} className="space-y-4 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Mi enfoque terapéutico
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Trabajo desde un enfoque integrativo: combino herramientas de
              distintos modelos terapéuticos con respaldo en la evidencia y las
              adapto a lo que cada persona necesita en su momento. Tengo especial
              formación en el abordaje del trauma, con certificación en EMDR, una
              de las terapias más respaldadas para procesar experiencias
              difíciles.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Más que aplicar una técnica única, mi objetivo es acompañarte a tu
              propio ritmo, en un vínculo de confianza donde puedas explorar tu
              historia, reconocer tus recursos y avanzar hacia el cambio que
              buscás.
            </p>
          </ScrollReveal>

          <ScrollReveal className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden bg-accent shadow-sm">
              <Image
                src="/sandra-sesion.jpg"
                alt="Sandra Carpio en sesión con un paciente en su consultorio"
                fill
                placeholder="blur"
                blurDataURL={BLUR.sesion}
                sizes="(min-width: 768px) 24rem, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Formación y credenciales */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto space-y-10">
          <ScrollReveal className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Formación y credenciales
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Formación académica
                </h3>
                <ul className="space-y-3">
                  {FORMACION_ACADEMICA.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Certificaciones y especializaciones
                </h3>
                <ul className="space-y-3">
                  {CERTIFICACIONES.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Certificado destacado */}
          <ScrollReveal delay={100}>
            <figure className="max-w-md mx-auto space-y-3">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
                <Image
                  src="/certificado-dbt.jpg"
                  alt="Certificado de Terapia Dialéctica Comportamental (DBT) — The Linehan Institute, a nombre de Sandra Carpio Monge"
                  fill
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="object-contain p-2"
                />
              </div>
              <figcaption className="text-center text-sm text-muted-foreground">
                Certificación en Terapia Dialéctica Comportamental (DBT) —
                The Linehan Institute · DBT Iberoamérica
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
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
