import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "cream" | "sand";
  id?: string;
  "aria-labelledby"?: string;
}

/**
 * Sección estándar con padding consistente.
 * Elimina la inconsistencia de py-14 / py-16 / py-20 entre páginas.
 */
export function Section({
  children,
  className,
  variant = "default",
  id,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "py-20 md:py-28 px-4",
        variant === "cream" && "bg-muted",
        variant === "sand" && "bg-accent",
        className
      )}
    >
      {children}
    </section>
  );
}
