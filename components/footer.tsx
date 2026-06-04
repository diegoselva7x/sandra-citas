import Link from "next/link";
import Image from "next/image";
import { getBookingSettings } from "@/app/booking/actions";
import { NAV_LINKS, waLink } from "@/lib/constants";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";

const FOOTER_NAV = [{ href: "/", label: "Inicio" }, ...NAV_LINKS];

export default async function Footer() {
  const settings = await getBookingSettings();
  const year = new Date().getFullYear();
  const waUrl = waLink(settings?.whatsapp_number);

  return (
    <footer className="border-t bg-muted mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Marca */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Image src="/logo.png" alt="Sandra Carpio" width={28} height={28} className="object-contain" />
            <p className="font-heading font-semibold text-base">Sandra Carpio</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Psicóloga · Costa Rica
          </p>
          {(waUrl || settings?.instagram_url) && (
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Escribir por WhatsApp"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Sandra"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Páginas
          </p>
          <nav className="flex flex-col gap-1.5 items-center sm:items-start">
            {FOOTER_NAV.map(({ href, label }) => (
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
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Legal
          </p>
          <nav className="flex flex-col gap-1.5 items-center sm:items-start">
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
