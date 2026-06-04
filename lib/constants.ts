/**
 * Constantes compartidas entre múltiples componentes.
 * Centralizadas aquí para evitar duplicación.
 */

// Navegación principal — compartida entre header, footer y mobile-nav
export const NAV_LINKS = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios", label: "Servicios" },
  { href: "/recursos", label: "Recursos" },
  { href: "/contacto", label: "Contacto" },
] as const;

// Links de anchor para la landing page (single-page scroll)
export const HOME_ANCHOR_LINKS = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#recursos", label: "Recursos" },
  { href: "#contacto", label: "Contacto" },
] as const;

// Construye un link de wa.me a partir de un número (con o sin formato) y un
// mensaje opcional prellenado. Devuelve null si no hay número.
export function waLink(
  number: string | null | undefined,
  text?: string,
): string | null {
  if (!number) return null;
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// Formateo de precios en colones costarricenses
export function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price);
}

// Modalidades de cita — etiquetas en español
export const MODALITY_LABEL: Record<string, string> = {
  online: "Virtual",
  in_person: "Presencial",
};

// Estados de citas — etiquetas en español
export const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmada",
  completed: "Completada",
  no_show: "No asistió",
  cancelled: "Cancelada",
};

// Estados de citas — variantes de Badge shadcn
export const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "default",
  completed: "secondary",
  no_show: "destructive",
  cancelled: "outline",
};
