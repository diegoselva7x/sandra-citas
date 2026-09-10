import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { NAV_LINKS } from "@/lib/constants";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name as string | undefined;

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-white/75 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="Sandra Carpio Psicóloga"
            width={32}
            height={32}
            priority
            className="object-contain"
          />
          <span className="font-semibold text-base tracking-tight">
            Sandra Carpio
          </span>
        </Link>

        {/* Navegación desktop — client component con active section tracking */}
        <NavLinks />

        {/* Sesión desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin">
                    <LayoutDashboard aria-hidden="true" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/mi-cuenta">
                  <User aria-hidden="true" />
                  {name?.split(" ")[0] ?? "Mi cuenta"}
                </Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut aria-hidden="true" />
                  Salir
                </Button>
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
        <MobileNav navLinks={NAV_LINKS} user={user ? { name, isAdmin } : null} />
      </div>
    </header>
  );
}
