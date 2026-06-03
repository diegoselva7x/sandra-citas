import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h — contenido estático

export const metadata: Metadata = {
  title: "Sobre mí · Sandra Carpio Psicóloga",
  description: "Conocé la historia, formación y enfoque de Sandra Carpio, psicóloga en Costa Rica.",
};

export default function SobreMiPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Placeholder foto */}
          <div className="rounded-2xl bg-muted flex items-center justify-center aspect-square max-w-xs mx-auto w-full">
            <div className="text-center text-muted-foreground space-y-2 p-8">
              <div className="w-20 h-20 rounded-full bg-muted-foreground/20 mx-auto" />
              <p className="text-sm">Foto de Sandra</p>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold">Sandra Carpio</h1>
            <p className="text-primary font-medium">Psicóloga clínica · Colegiada</p>
            <p className="text-muted-foreground leading-relaxed">
              Pendiente
            </p>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">Mi historia</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Pendiente</p>
          </div>
        </div>
      </section>

      {/* Formación */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">Formación y credenciales</h2>
          <ul className="space-y-4">
            {[
              "Pendiente",
              "Pendiente",
              "Pendiente",
              "Pendiente",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enfoque */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">Mi enfoque terapéutico</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pendiente
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-14 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">¿Querés conocernos mejor?</h2>
          <p className="text-muted-foreground text-sm">
            La primera sesión es el mejor lugar para empezar.
          </p>
          <Button asChild size="lg">
            <Link href="/reservar">Reservar mi primera cita</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
