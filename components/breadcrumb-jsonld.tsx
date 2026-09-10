import { SITE_URL } from "@/lib/constants";
const SITE = SITE_URL;

interface Crumb {
  name: string;
  /** Ruta relativa, ej. "/servicios". La home se agrega automáticamente. */
  path: string;
}

/**
 * Emite un JSON-LD `BreadcrumbList` (Inicio → página actual) para que Google
 * pueda mostrar la miga de pan en los resultados. Server component: solo
 * renderiza un <script>, sin JS en el cliente.
 */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const list = [{ name: "Inicio", path: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.path === "/" ? SITE : `${SITE}${c.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
