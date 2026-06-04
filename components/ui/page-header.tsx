import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
  centered?: boolean;
}

/**
 * Hero header reutilizable para páginas internas.
 * Siempre incluye un h1 con font-heading (serif).
 */
export function PageHeader({
  title,
  subtitle,
  id = "page-title",
  className,
  centered = true,
}: PageHeaderProps) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "py-16 md:py-24 px-4 bg-muted",
        centered && "text-center",
        className
      )}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <h1
          id={id}
          className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
