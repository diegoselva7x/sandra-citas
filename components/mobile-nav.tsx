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
  user: { name?: string } | null;
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
                className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                  pathname === href
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t pt-6 space-y-2">
            {user ? (
              <>
                <Link
                  href="/mi-cuenta"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {user.name?.split(" ")[0] ?? "Mi cuenta"}
                </Link>
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm" className="w-full">
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
