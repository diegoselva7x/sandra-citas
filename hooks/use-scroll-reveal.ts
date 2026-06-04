"use client";

import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Hook de scroll reveal con graceful degradation.
 * El contenido es SIEMPRE visible si JS no carga o hay un error.
 * La clase que oculta (.reveal-hidden) solo se aplica después de que este hook monta.
 * Respeta prefers-reduced-motion: si el usuario prefiere movimiento reducido, el
 * contenido permanece visible y no hay transición.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", delay = 0 } =
    options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta prefers-reduced-motion: no ocultar ni animar
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // Solo ahora que JS está activo, aplicamos la clase que oculta
    el.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add("reveal-visible");
              }, delay);
            } else {
              entry.target.classList.add("reveal-visible");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return ref;
}
