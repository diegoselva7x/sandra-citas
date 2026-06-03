import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi cuenta · Sandra Mora Psicóloga",
  robots: { index: false, follow: false },
};
import { redirect } from "next/navigation";
import { getMyAppointments, getMyProfile } from "./actions";
import { AccountTabs } from "@/components/account/account-tabs";

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [appointments, profile] = await Promise.all([
    getMyAppointments(),
    getMyProfile(),
  ]);

  if (!profile) redirect("/login");

  const now = new Date().toISOString();

  const upcoming = appointments.filter(
    (a) => a.status === "confirmed" && a.starts_at > now,
  );
  const past = appointments.filter(
    (a) => a.status !== "confirmed" || a.starts_at <= now,
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Hola, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestioná tus citas y tu información personal.
        </p>
      </div>

      <AccountTabs upcoming={upcoming} past={past} profile={profile} />
    </main>
  );
}
