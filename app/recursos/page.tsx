import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h — contenido educativo estático

export const metadata: Metadata = {
  title: "Recursos",
  description: "Contenido educativo sobre salud mental, terapia de pareja y bienestar familiar.",
  alternates: { canonical: "/recursos" },
};

const RECURSOS = [
  {
    id: "ayuda",
    titulo: "¿Por qué buscar ayuda psicológica?",
    contenido: `Buscar apoyo psicológico no es señal de debilidad, sino de valentía y autoconocimiento.
    Muchas personas esperan hasta estar en crisis para pedir ayuda, cuando en realidad la terapia
    puede ser valiosa en cualquier momento: cuando queremos crecer, cuando algo nos pesa, o
    simplemente cuando necesitamos un espacio para nosotros.`,
    cta: false,
  },
  {
    id: "primera-sesion",
    titulo: "¿Qué esperar de la primera sesión?",
    contenido: `La primera sesión es una conversación. No hay preguntas correctas ni incorrectas.
    Es un espacio para que te conozcamos y podamos entender qué te trajo aquí. No te preocupes
    por "prepararte" — llegá como estás.`,
    cta: true,
  },
  {
    id: "pareja",
    titulo: "Terapia de pareja",
    contenido: `Las relaciones pasan por ciclos y momentos difíciles. La terapia de pareja no
    es solo para cuando hay crisis: también es una herramienta de crecimiento conjunto, de
    aprender a comunicarse mejor y a construir una relación más sana.

    Algunas señales de que podrían beneficiarse:
    • Sienten que hablan pero no se escuchan
    • Los mismos conflictos se repiten sin resolución
    • Se alejaron emocionalmente
    • Atravesaron un evento difícil (infidelidad, pérdida, cambio grande)`,
    cta: false,
  },
  {
    id: "familia",
    titulo: "Orientación familiar",
    contenido: `Las familias son sistemas vivos: cambian, se reorganizan, atraviesan crisis.
    La terapia familiar ayuda a mejorar la comunicación, a resolver conflictos entre generaciones
    y a acompañar cambios importantes como divorcios, duelos o la llegada de un nuevo miembro.`,
    cta: false,
  },
  {
    id: "salud-mental",
    titulo: "Cuidar tu salud mental",
    contenido: `La salud mental es tan importante como la física, pero solemos ignorarla hasta
    que algo falla. Pequeños hábitos diarios, saber reconocer las señales de alerta y tener a
    alguien con quien hablar marcan una diferencia enorme.`,
    cta: false,
  },
];

export default function RecursosPage() {
  // FAQPage JSON-LD construido desde los Q&A visibles (citabilidad en IA + rich results)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: RECURSOS.map((r) => ({
      "@type": "Question",
      name: r.titulo,
      acceptedAnswer: {
        "@type": "Answer",
        text: r.contenido.replace(/\s+/g, " ").trim(),
      },
    })),
  };

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageHeader
        title="Recursos de salud mental"
        subtitle="Información y perspectivas sobre salud mental para que tomes decisiones informadas sobre tu bienestar."
      />

      {/* Contenido */}
      <Section>
        <div className="max-w-3xl mx-auto space-y-14">
          {RECURSOS.map((recurso, i) => (
            <ScrollReveal key={recurso.id} delay={i * 60}>
              <article
                id={recurso.id}
                className={`space-y-4 scroll-mt-24 ${
                  i !== RECURSOS.length - 1 ? "pb-14 border-b" : ""
                }`}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {recurso.titulo}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {recurso.contenido}
                </div>
                {recurso.cta && (
                  <Button asChild>
                    <Link href="/reservar">Reservar tu primera cita</Link>
                  </Button>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cream">
        <ScrollReveal className="max-w-md mx-auto space-y-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            ¿Tenés preguntas?
          </h2>
          <p className="text-muted-foreground">
            No hay preguntas tontas. Escribime y con gusto te oriento.
          </p>
          <Button asChild variant="glass" size="lg" className="text-base px-8 py-5 h-auto">
            <Link href="/contacto">Contactarme</Link>
          </Button>
        </ScrollReveal>
      </Section>
    </main>
  );
}
