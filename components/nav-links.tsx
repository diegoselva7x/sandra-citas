"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/sobre-mi", label: "Sobre mí", anchorId: "sobre-mi" },
  { href: "/servicios", label: "Servicios", anchorId: "servicios" },
  { href: "/recursos", label: "Recursos", anchorId: "recursos" },
  { href: "/contacto", label: "Contacto", anchorId: "contacto" },
];

const LINK_CLASS =
  "text-sm transition-colors duration-150 px-3 py-1.5 rounded-md";
const ACTIVE_CLASS = "text-foreground bg-accent font-medium";
const INACTIVE_CLASS = "text-muted-foreground hover:text-foreground hover:bg-accent";

interface NavLinksProps {
  className?: string;
}

/**
 * Navegación principal — desktop.
 * En la landing page (/): usa anchor links + IntersectionObserver para
 * resaltar la sección activa mientras el usuario hace scroll.
 * En otras páginas: usa Next.js Link con pathname matching.
 */
export function NavLinks({ className }: NavLinksProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ["inicio", ...LINKS.map((l) => l.anchorId)];

    const observer = new IntersectionObserver(
      (entries) => {
        // Tomamos la sección más visible que está intersectando
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.5],
        rootMargin: "-10% 0px -40% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav className={cn("hidden md:flex items-center gap-1 flex-1", className)}>
      {LINKS.map(({ href, label, anchorId }) => {
        const isActive = isHome
          ? activeSection === anchorId
          : pathname === href || pathname.startsWith(href + "/");

        if (isHome) {
          return (
            <a
              key={href}
              href={`#${anchorId}`}
              className={cn(LINK_CLASS, isActive ? ACTIVE_CLASS : INACTIVE_CLASS)}
            >
              {label}
            </a>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={cn(LINK_CLASS, isActive ? ACTIVE_CLASS : INACTIVE_CLASS)}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
