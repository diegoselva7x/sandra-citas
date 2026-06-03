import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h — contenido educativo estático

export const metadata: Metadata = {
  title: "Recursos · Sandra Mora Psicóloga",
  description: "Contenido educativo sobre salud mental, terapia de pareja y bienestar familiar.",
};

const RECURSOS = [
  {
    id: "ayuda",
    titulo: "¿Por qué buscar ayuda psicológica?",
    // TODO: contenido de Sandra — normalizar la terapia
    contenido: `Buscar apoyo psicológico no es señal de debilidad, sino de valentía y autoconocimiento.
    Muchas personas esperan hasta estar en crisis para pedir ayuda, cuando en realidad la terapia
    puede ser valiosa en cualquier momento: cuando queremos crecer, cuando algo nos pesa, o
    simplemente cuando necesitamos un espacio para nosotros.

    [TODO: contenido de Sandra — expandir este tema con su perspectiva personal]`,
    cta: false,
  },
  {
    id: "primera-sesion",
    titulo: "¿Qué esperar de la primera sesión?",
    // TODO: contenido de Sandra — cómo funciona la primera consulta
    contenido: `La primera sesión es una conversación. No hay preguntas correctas ni incorrectas.
    Es un espacio para que te conozcamos y podamos entender qué te trajo aquí. No te preocupes
    por "prepararte" — llegá como estás.

    [TODO: contenido de Sandra — descripción de cómo conduce la primera consulta]`,
    cta: true,
  },
  {
    id: "pareja",
    titulo: "Terapia de pareja",
    // TODO: contenido de Sandra — señales de que la pareja se beneficiaría de terapia
    contenido: `Las relaciones pasan por ciclos y momentos difíciles. La terapia de pareja no
    es solo para cuando hay crisis: también es una herramienta de crecimiento conjunto, de
    aprender a comunicarse mejor y a construir una relación más sana.

    Algunas señales de que podrían beneficiarse:
    • Sienten que hablan pero no se escuchan
    • Los mismos conflictos se repiten sin resolución
    • Se alejaron emocionalmente
    • Atravesaron un evento difícil (infidelidad, pérdida, cambio grande)

    [TODO: contenido de Sandra — ampliar con su experiencia en terapia de pareja]`,
    cta: false,
  },
  {
    id: "familia",
    titulo: "Orientación familiar",
    // TODO: contenido de Sandra — cuándo buscar ayuda familiar
    contenido: `Las familias son sistemas vivos: cambian, se reorganizan, atraviesan crisis.
    La terapia familiar ayuda a mejorar la comunicación, a resolver conflictos entre generaciones
    y a acompañar cambios importantes como divorcios, duelos o la llegada de un nuevo miembro.

    [TODO: contenido de Sandra — perspectiva personal sobre trabajo con familias]`,
    cta: false,
  },
  {
    id: "salud-mental",
    titulo: "Cuidar tu salud mental",
    // TODO: contenido de Sandra — educación sobre salud mental general
    contenido: `La salud mental es tan importante como la física, pero solemos ignorarla hasta
    que algo falla. Pequeños hábitos diarios, saber reconocer las señales de alerta y tener a
    alguien con quien hablar marcan una diferencia enorme.

    [TODO: contenido de Sandra — consejos, recursos, perspectiva profesional]`,
    cta: false,
  },
];

export default function RecursosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-semibold">Recursos</h1>
          <p className="text-muted-foreground leading-relaxed">
            Información y perspectivas sobre salud mental para que tomes decisiones
            informadas sobre tu bienestar.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto space-y-14">
          {RECURSOS.map((recurso, i) => (
            <article
              key={recurso.id}
              id={recurso.id}
              className={`space-y-4 ${i !== RECURSOS.length - 1 ? "pb-14 border-b" : ""}`}
            >
              <h2 className="text-xl font-semibold">{recurso.titulo}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {recurso.contenido}
              </div>
              {recurso.cta && (
                <Button asChild>
                  <Link href="/reservar">Reservar tu primera cita</Link>
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">¿Tenés preguntas?</h2>
          <p className="text-sm text-muted-foreground">
            No hay preguntas tontas. Escribime y con gusto te oriento.
          </p>
          <Button asChild size="lg">
            <Link href="/contacto">Contactarme</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
