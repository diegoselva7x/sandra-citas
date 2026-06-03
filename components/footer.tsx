import Link from "next/link";
import { getBookingSettings } from "@/app/booking/actions";

export default async function Footer() {
  const settings = await getBookingSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Marca */}
        <div className="space-y-2">
          <p className="font-semibold text-base">Sandra Carpio</p>
          <p className="text-sm text-muted-foreground">
            Psicóloga · Costa Rica
          </p>
          {settings?.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary underline"
            >
              WhatsApp
            </a>
          )}
        </div>

        {/* Navegación */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Páginas
          </p>
          <nav className="flex flex-col gap-1.5">
            {[
              { href: "/", label: "Inicio" },
              { href: "/sobre-mi", label: "Sobre mí" },
              { href: "/servicios", label: "Servicios" },
              { href: "/recursos", label: "Recursos" },
              { href: "/contacto", label: "Contacto" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Legal
          </p>
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/privacidad"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Términos de uso
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {year} Sandra Carpio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
