import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios", label: "Servicios" },
  { href: "/recursos", label: "Recursos" },
  { href: "/contacto", label: "Contacto" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name as string | undefined;

  return (
    <header className="border-b bg-background sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Sandra Carpio" width={32} height={32} className="object-contain" />
          <span className="font-semibold text-base tracking-tight">Sandra Carpio</span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-accent"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Sesión desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                href="/mi-cuenta"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                {name?.split(" ")[0] ?? "Mi cuenta"}
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">Salir</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/reservar">Reservar cita</Link>
              </Button>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <MobileNav navLinks={NAV_LINKS} user={user ? { name } : null} />
      </div>
    </header>
  );
}
