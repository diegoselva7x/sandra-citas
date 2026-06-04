import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getActiveServices, getBookingSettings } from "@/app/booking/actions";
import { formatPrice, waLink } from "@/lib/constants";
import { InstagramIcon } from "@/components/ui/brand-icons";
import {
  Clock,
  Monitor,
  MapPin,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicologasandra.com";

// Vista previa de recursos para la landing
const RECURSOS_PREVIEW = [
  {
    id: "ayuda",
    titulo: "¿Por qué buscar ayuda psicológica?",
    resumen:
      "Buscar apoyo no es señal de debilidad, sino de valentía y autoconocimiento.",
  },
  {
    id: "primera-sesion",
    titulo: "¿Qué esperar de la primera sesión?",
    resumen:
      "La primera sesión es una conversación tranquila, sin preguntas correctas ni incorrectas.",
  },
  {
    id: "pareja",
    titulo: "Terapia de pareja",
    resumen:
      "Un espacio seguro para mejorar la comunicación y construir una relación más sana.",
  },
];

export default async function HomePage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getBookingSettings(),
  ]);

  const whatsappHref = waLink(
    settings?.whatsapp_number,
    "Hola Sandra, me gustaría hacerte una consulta.",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "MedicalBusiness"],
        "@id": SITE,
        name: "Sandra Carpio · Psicóloga",
        description:
          "Servicio de psicología individual, de pareja y familiar en Costa Rica. Modalidad presencial y virtual.",
        url: SITE,
        image: `${SITE}/og-image.jpg`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressCountry: "CR",
          addressRegion: "San José",
        },
        areaServed: {
          "@type": "Country",
          name: "Costa Rica",
        },
        founder: {
          "@type": "Person",
          name: "Sandra Carpio",
          jobTitle: "Psicóloga",
          url: `${SITE}/sobre-mi`,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de psicología",
          itemListElement: services.slice(0, 5).map((s, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.description ?? undefined,
            },
          })),
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex flex-col">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          id="inicio"
          aria-labelledby="hero-title"
          className="relative flex items-center bg-background min-h-[calc(100vh-3.5rem)] px-4 py-20 md:py-0"
        >
          <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Texto */}
            <ScrollReveal className="space-y-7">
              <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-foreground">
                Psicóloga · Costa Rica
              </span>
              <h1
                id="hero-title"
                className="text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-foreground"
              >
                Tu bienestar
                <br />
                <span className="text-foreground/80 italic">
                  emocional
                </span>{" "}
                importa
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Acompañamiento psicológico individual, de pareja y familiar.
                Modalidad presencial y virtual desde la comodidad de tu hogar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button asChild variant="glass" size="lg" className="text-base px-7 py-5 h-auto">
                  <Link href="/reservar">Reservar mi cita</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-7 py-5 h-auto">
                  <a href="#sobre-mi">Conocer a Sandra</a>
                </Button>
              </div>
            </ScrollReveal>

            {/* Foto principal */}
            <ScrollReveal delay={150} className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden bg-accent shadow-sm">
                <Image
                  src="/sandra-principal.png"
                  alt="Sandra Carpio, psicóloga, en su consultorio"
                  fill
                  priority
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Indicador scroll — solo en desktop (en móvil se encimaba con la foto) */}
          <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground/50 motion-reduce:hidden">
            <span className="text-xs tracking-widest uppercase">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
          </div>
        </section>

        {/* ── SOBRE MÍ ─────────────────────────────────────────────────── */}
        <section
          id="sobre-mi"
          aria-labelledby="sobre-mi-title"
          className="bg-muted py-24 md:py-32 px-4"
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Foto secundaria */}
            <ScrollReveal className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden bg-accent shadow-sm">
                <Image
                  src="/sandra-origami.jpg"
                  alt="Sandra Carpio"
                  fill
                  sizes="(min-width: 768px) 20rem, 100vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            {/* Texto */}
            <ScrollReveal delay={100} className="space-y-6 order-1 md:order-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Sobre mí
                </p>
                <h2
                  id="sobre-mi-title"
                  className="text-3xl md:text-4xl font-semibold leading-tight text-foreground"
                >
                  Hola, soy Sandra
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {/* TODO: contenido de Sandra — bio breve (2-3 párrafos) */}
                <p>
                  Soy psicóloga con formación en terapia individual, de pareja y
                  familiar. Creo en un acompañamiento cálido, sin juicios, donde
                  cada persona pueda explorar su mundo interior a su propio ritmo.
                </p>
                <p>
                  {/* TODO: contenido de Sandra — especialidad, enfoque terapéutico */}
                  Mi enfoque es integrador, adaptado a las necesidades de cada
                  persona. Trabajo tanto de forma presencial como virtual.
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link href="/sobre-mi" className="inline-flex items-center gap-2">
                  Conocer mi historia
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>

        {/* ── SERVICIOS ──────────────────────────────────────────────────── */}
        <section
          id="servicios"
          aria-labelledby="servicios-title"
          className="py-24 md:py-32 px-4"
        >
          <div className="max-w-5xl mx-auto space-y-12">
            <ScrollReveal className="text-center space-y-4 max-w-xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Servicios
              </p>
              <h2
                id="servicios-title"
                className="text-3xl md:text-4xl font-semibold text-foreground"
              >
                ¿En qué te puedo acompañar?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Elegí el tipo de acompañamiento que mejor se adapte a lo que
                necesitás.
              </p>
            </ScrollReveal>

            {services.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5 auto-rows-fr max-w-3xl mx-auto">
                {services.slice(0, 6).map((service, i) => (
                  <ScrollReveal key={service.id} delay={i * 60} className="h-full">
                    <Link
                      href="/reservar"
                      className="group flex flex-col h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-semibold text-foreground">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-snug">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration_minutes} min
                        </span>
                        {service.price && (
                          <span className="font-semibold text-foreground">
                            {formatPrice(service.price)}
                          </span>
                        )}
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Reservar
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Servicios próximamente.
              </p>
            )}

            {/* Modalidades */}
            <ScrollReveal>
              <div className="grid sm:grid-cols-2 gap-5 pt-4">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-foreground">Presencial</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sesión en consultorio. Ambiente tranquilo y confidencial.
                  </p>
                  <div className="space-y-2 pt-1">
                    <p className="text-sm text-foreground">
                      {settings?.address ?? "Cartago, Provincia de Cartago, Costa Rica"}
                    </p>
                    <Link
                      href="/contacto#ubicacion"
                      className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors"
                    >
                      Cómo llegar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-foreground">Virtual</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sesión por videollamada. Sandra te envía el enlace por
                    WhatsApp uno o dos días antes.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="text-center">
              <Button asChild variant="glass" size="lg" className="text-base px-8 py-5 h-auto">
                <Link href="/reservar">Reservar mi cita</Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>

        {/* ── RECURSOS ──────────────────────────────────────────────────── */}
        <section
          id="recursos"
          aria-labelledby="recursos-title"
          className="bg-muted py-24 md:py-32 px-4"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <ScrollReveal className="text-center space-y-4 max-w-xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Recursos
              </p>
              <h2
                id="recursos-title"
                className="text-3xl md:text-4xl font-semibold text-foreground"
              >
                Aprende sobre salud mental
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Artículos y reflexiones para acompañarte en tu proceso.
              </p>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {RECURSOS_PREVIEW.map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 80}>
                  <Link href={`/recursos#${r.id}`} className="group block">
                    <article className="rounded-2xl border border-border bg-background p-6 space-y-3 h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
                      <h3 className="font-semibold text-foreground leading-snug group-hover:text-foreground/80 transition-colors">
                        {r.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {r.resumen}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Leer más
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="text-center">
              <Button asChild variant="outline">
                <Link href="/recursos" className="inline-flex items-center gap-2">
                  Ver todos los recursos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>

        {/* ── CONTACTO ──────────────────────────────────────────────────── */}
        <section
          id="contacto"
          aria-labelledby="contacto-title"
          className="py-24 md:py-32 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <ScrollReveal className="text-center space-y-4 max-w-xl mx-auto mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Contacto
              </p>
              <h2
                id="contacto-title"
                className="text-3xl md:text-4xl font-semibold text-foreground"
              >
                ¿Listo/a para dar el primer paso?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservar tu cita es fácil y toma menos de un minuto.
              </p>
            </ScrollReveal>

            <ScrollReveal className="grid sm:grid-cols-2 gap-5 mb-10">
              {/* Info de contacto */}
              <div className="rounded-2xl border border-border bg-card p-7 space-y-5">
                <h3 className="font-semibold text-foreground">
                  Información de contacto
                </h3>
                <ul className="space-y-4">
                  {settings?.contact_email && (
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0 text-foreground/50" />
                      <span>{settings.contact_email}</span>
                    </li>
                  )}
                  {settings?.whatsapp_number && (
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0 text-foreground/50" />
                      <span>{settings.whatsapp_number}</span>
                    </li>
                  )}
                  {settings?.instagram_url && (
                    <li className="flex items-center gap-3 text-sm">
                      <InstagramIcon className="w-4 h-4 shrink-0 text-foreground/50" />
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors"
                      >
                        @sandcarpio
                      </a>
                    </li>
                  )}
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 text-foreground/50 mt-0.5" />
                    <span>
                      {settings?.address ?? "Costa Rica · Modalidad presencial y virtual"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA glass */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent p-7 space-y-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Hablemos por WhatsApp
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ¿Tenés dudas antes de reservar? Escribime directamente.
                  </p>
                </div>
                {whatsappHref ? (
                  <Button
                    asChild
                    variant="glass"
                    className="w-full text-sm"
                  >
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Escribir por WhatsApp
                    </a>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    WhatsApp próximamente
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* CTA principal */}
            <ScrollReveal className="text-center space-y-4">
              <Button asChild variant="glass" size="lg" className="text-base px-10 py-5 h-auto">
                <Link href="/reservar">Reservar mi cita ahora</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                También podés{" "}
                <Link
                  href="/contacto"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  enviarnos un mensaje
                </Link>
                .
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
}
