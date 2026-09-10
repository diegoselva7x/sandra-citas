// Layout del panel de administración con navegación lateral.
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, Settings } from "lucide-react";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/citas", label: "Citas", icon: CalendarDays },
  { href: "/admin/pacientes", label: "Pacientes", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if ((profile as Pick<Profile, "role"> | null)?.role !== "admin") redirect("/");

  const name = (profile as Pick<Profile, "full_name"> | null)?.full_name ?? "Admin";

  return (
    <div className="admin-scale flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card shrink-0">
        <div className="px-4 py-5 border-b">
          <p className="text-xs text-muted-foreground">Panel de administración</p>
          <p className="font-medium text-sm mt-0.5 truncate">{name}</p>
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Nav mobile (barra inferior) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10 flex">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
    </div>
  );
}
