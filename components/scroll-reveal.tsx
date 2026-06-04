"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

/**
 * Wrapper que aplica animación de fade+slide al entrar en el viewport.
 * Graceful degradation: si JS no monta, el contenido es visible por defecto.
 * La clase que oculta se aplica solo después de que el efecto corra en el cliente.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({ delay });

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
