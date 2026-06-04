// Layout compartido para las páginas de autenticación.
// Muestra una tarjeta centrada ideal para celular y escritorio.
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-heading text-2xl font-semibold tracking-tight text-foreground"
        >
          Sandra Carpio
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Psicóloga · Costa Rica</p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
