"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./appointment-card";
import { ProfileForm } from "./profile-form";
import type { AppointmentWithService } from "@/app/mi-cuenta/actions";
import type { Profile } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarDays } from "lucide-react";

interface Props {
  upcoming: AppointmentWithService[];
  past: AppointmentWithService[];
  profile: Profile;
}

export function AccountTabs({ upcoming, past, profile }: Props) {
  return (
    <Tabs defaultValue="citas">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="citas" className="flex-1">
          Mis citas
          {upcoming.length > 0 && (
            <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5 leading-none">
              {upcoming.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="perfil" className="flex-1">Mi perfil</TabsTrigger>
      </TabsList>

      <TabsContent value="citas" className="space-y-6">
        {/* Próximas */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Próximas
          </h2>
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No tenés citas próximas"
              description="Cuando reservés una cita, aparecerá acá."
              action={
                <Button asChild size="sm">
                  <Link href="/reservar">Reservar una cita</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} upcoming />
              ))}
            </div>
          )}
        </section>

        {/* Pasadas */}
        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Historial
            </h2>
            <div className="space-y-3">
              {past.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} upcoming={false} />
              ))}
            </div>
          </section>
        )}
      </TabsContent>

      <TabsContent value="perfil">
        <ProfileForm profile={profile} />
      </TabsContent>
    </Tabs>
  );
}
