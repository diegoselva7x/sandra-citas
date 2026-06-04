import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  mapsUrl?: string | null;
  address?: string | null;
}

/**
 * Mapa embebido de Google Maps (iframe, sin API key) + botón "Cómo llegar".
 * Requiere `frame-src https://www.google.com` en la CSP (ver next.config.ts).
 */
export function LocationMap({ latitude, longitude, mapsUrl, address }: LocationMapProps) {
  const embedSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&hl=es&output=embed`;
  const directionsUrl =
    mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="space-y-3">
      <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-border">
        <iframe
          src={embedSrc}
          title="Ubicación del consultorio de Sandra"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {address && (
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{address}</span>
        </p>
      )}
      <Button asChild variant="outline" size="sm">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Cómo llegar
        </a>
      </Button>
    </div>
  );
}
