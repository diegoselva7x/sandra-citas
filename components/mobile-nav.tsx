"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { signOut } from "@/app/auth/actions";

interface Props {
  navLinks: { href: string; label: string }[];
  user: { name?: string; isAdmin?: boolean } | null;
}

export function MobileNav({ navLinks, user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menú">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 pt-10">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-accent text-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t pt-4 space-y-2">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Panel admin
                  </Link>
                )}
                <Link
                  href="/mi-cuenta"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Mi cuenta
                </Link>
                <form action={signOut}>
                  <Button type="submit" variant="outline" className="w-full">
                    Salir
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/login">Ingresar</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/reservar">Reservar cita</Link>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
