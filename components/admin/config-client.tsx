// Panel de configuración: ajustes, servicios, disponibilidad, bloqueos.
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateSettings,
  upsertServiceType,
  toggleServiceType,
  upsertAvailabilityRule,
  deleteAvailabilityRule,
  createDateBlock,
  deleteDateBlock,
} from "@/app/admin/actions";
import type { ServiceType, Settings } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SuccessMessage } from "@/components/ui/success-message";
import { Trash2, Plus } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { TIMEZONE } from "@/lib/types";
import { formatPrice } from "@/lib/constants";
import { es } from "date-fns/locale";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface AvailabilityRule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface DateBlock {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}

interface Props {
  settings: Settings;
  services: ServiceType[];
  rules: AvailabilityRule[];
  blocks: DateBlock[];
}


function SettingsSection({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    accepting_new_patients: settings.accepting_new_patients,
    whatsapp_number: settings.whatsapp_number ?? "",
    contact_email: settings.contact_email ?? "",
    online_instructions: settings.online_instructions ?? "",
    instagram_url: settings.instagram_url ?? "",
    address: settings.address ?? "",
    maps_url: settings.maps_url ?? "",
    latitude: settings.latitude?.toString() ?? "",
    longitude: settings.longitude?.toString() ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null); setSaved(false);
    startTransition(async () => {
      const result = await updateSettings({
        accepting_new_patients: form.accepting_new_patients,
        whatsapp_number: form.whatsapp_number || null,
        contact_email: form.contact_email || null,
        online_instructions: form.online_instructions || null,
        instagram_url: form.instagram_url || null,
        address: form.address || null,
        maps_url: form.maps_url || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      if (result.error) setError(result.error);
      else { setSaved(true); router.refresh(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-medium text-sm">Aceptando pacientes nuevos</p>
          <p className="text-xs text-muted-foreground">Si está desactivado, solo los pacientes existentes podrán reservar.</p>
        </div>
        <Switch
          checked={form.accepting_new_patients}
          onCheckedChange={(v) => setForm((f) => ({ ...f, accepting_new_patients: v }))}
        />
      </div>

      {[
        { key: "whatsapp_number", label: "Número de WhatsApp", placeholder: "+506 8888-8888" },
        { key: "contact_email", label: "Correo de contacto", placeholder: "sandra@ejemplo.com" },
        { key: "instagram_url", label: "Instagram (URL)", placeholder: "https://www.instagram.com/usuario/" },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Input
            placeholder={placeholder}
            value={(form as unknown as Record<string, string>)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        </div>
      ))}

      <div className="space-y-1.5">
        <Label>Instrucciones para citas online</Label>
        <Input
          placeholder="Sandra te enviará el enlace…"
          value={form.online_instructions}
          onChange={(e) => setForm((f) => ({ ...f, online_instructions: e.target.value }))}
        />
      </div>

      <Separator />
      <p className="text-sm font-medium">Ubicación del consultorio</p>

      <div className="space-y-1.5">
        <Label>Dirección (texto)</Label>
        <Input
          placeholder="Ej: Cartago, Costa Rica"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Link de Google Maps (botón “Cómo llegar”)</Label>
        <Input
          placeholder="https://www.google.com/maps/place/…"
          value={form.maps_url}
          onChange={(e) => setForm((f) => ({ ...f, maps_url: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Latitud</Label>
          <Input
            type="number"
            step="any"
            placeholder="9.8612814"
            value={form.latitude}
            onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Longitud</Label>
          <Input
            type="number"
            step="any"
            placeholder="-83.9111481"
            value={form.longitude}
            onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        El mapa de la página de contacto usa la latitud y longitud. Las podés sacar de
        Google Maps (clic derecho sobre el punto → copiar coordenadas).
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <SuccessMessage>Cambios guardados.</SuccessMessage>}
      <Button onClick={save} disabled={isPending}>{isPending ? "Guardando…" : "Guardar"}</Button>
    </div>
  );
}


function ServicesSection({ services }: { services: ServiceType[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Partial<ServiceType> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!editing) return;
    setError(null);
    startTransition(async () => {
      const result = await upsertServiceType({
        ...editing,
        duration_minutes: Number(editing.duration_minutes ?? 50),
        price: editing.price ? Number(editing.price) : null,
        sort_order: Number(editing.sort_order ?? 0),
      });
      if (result.error) setError(result.error);
      else { setEditing(null); router.refresh(); }
    });
  };

  const toggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleServiceType(id, !current);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${!s.is_active ? "line-through text-muted-foreground" : ""}`}>{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.duration_minutes} min{s.price ? ` · ${formatPrice(s.price)}` : ""}</p>
            </div>
            <Switch checked={s.is_active} onCheckedChange={() => toggle(s.id, s.is_active)} />
            <Button size="sm" variant="ghost" onClick={() => setEditing(s)}>Editar</Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => setEditing({ duration_minutes: 50, sort_order: 0 })}>
        <Plus className="w-4 h-4 mr-1.5" /> Agregar servicio
      </Button>

      {editing && (
        <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
          <h3 className="font-medium text-sm">{editing.id ? "Editar servicio" : "Nuevo servicio"}</h3>
          {[
            { key: "name", label: "Nombre", type: "text" },
            { key: "description", label: "Descripción (opcional)", type: "text" },
            { key: "duration_minutes", label: "Duración (minutos)", type: "number" },
            { key: "price", label: "Precio (₡, opcional)", type: "number" },
            { key: "sort_order", label: "Orden de aparición", type: "number" },
          ].map(({ key, label, type }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                type={type}
                value={(editing as Record<string, unknown>)[key] as string ?? ""}
                onChange={(e) => setEditing((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { setEditing(null); setError(null); }}>Cancelar</Button>
            <Button size="sm" onClick={save} disabled={isPending}>{isPending ? "Guardando…" : "Guardar"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}


function AvailabilitySection({ rules }: { rules: AvailabilityRule[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newRule, setNewRule] = useState({ day_of_week: 1, start_time: "09:00", end_time: "17:00" });
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    setError(null);
    startTransition(async () => {
      const result = await upsertAvailabilityRule(newRule);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteAvailabilityRule(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
            <span className="w-8 text-sm font-medium">{DAYS[r.day_of_week]}</span>
            <span className="flex-1 text-sm text-muted-foreground">{r.start_time} – {r.end_time}</span>
            <Button size="icon" variant="ghost" onClick={() => remove(r.id)} disabled={isPending}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        {rules.length === 0 && <p className="text-sm text-muted-foreground">No hay reglas configuradas.</p>}
      </div>

      <Separator />
      <p className="text-sm font-medium">Agregar horario</p>
      <div className="flex gap-2 flex-wrap">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={newRule.day_of_week}
          onChange={(e) => setNewRule((r) => ({ ...r, day_of_week: Number(e.target.value) }))}
        >
          {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
        <Input type="time" className="w-32" value={newRule.start_time} onChange={(e) => setNewRule((r) => ({ ...r, start_time: e.target.value }))} />
        <Input type="time" className="w-32" value={newRule.end_time} onChange={(e) => setNewRule((r) => ({ ...r, end_time: e.target.value }))} />
        <Button size="sm" onClick={add} disabled={isPending}><Plus className="w-4 h-4 mr-1" />Agregar</Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}


function BlocksSection({ blocks }: { blocks: DateBlock[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ starts_at: "", ends_at: "", reason: "" });
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    if (!form.starts_at || !form.ends_at) { setError("Completá ambas fechas."); return; }
    setError(null);
    // Convertir fechas locales a ISO con zona horaria CR
    const startsAt = new Date(form.starts_at + ":00").toISOString();
    const endsAt = new Date(form.ends_at + ":00").toISOString();
    startTransition(async () => {
      const result = await createDateBlock({ starts_at: startsAt, ends_at: endsAt, reason: form.reason || null });
      if (result.error) setError(result.error);
      else { setForm({ starts_at: "", ends_at: "", reason: "" }); router.refresh(); }
    });
  };

  const remove = (id: string) => {
    startTransition(async () => { await deleteDateBlock(id); router.refresh(); });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {blocks.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex-1 min-w-0 text-sm">
              <p className="font-medium">
                {formatInTimeZone(new Date(b.starts_at), TIMEZONE, "d MMM HH:mm", { locale: es })}
                {" — "}
                {formatInTimeZone(new Date(b.ends_at), TIMEZONE, "d MMM HH:mm", { locale: es })}
              </p>
              {b.reason && <p className="text-xs text-muted-foreground">{b.reason}</p>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(b.id)} disabled={isPending}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-sm text-muted-foreground">No hay bloqueos activos.</p>}
      </div>

      <Separator />
      <p className="text-sm font-medium">Agregar bloqueo</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1"><Label className="text-xs">Desde</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} /></div>
        <div className="space-y-1"><Label className="text-xs">Hasta</Label><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} /></div>
      </div>
      <Input placeholder="Motivo (opcional)" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button size="sm" onClick={add} disabled={isPending}><Plus className="w-4 h-4 mr-1" />Agregar bloqueo</Button>
    </div>
  );
}


export function ConfigClient({ settings, services, rules, blocks }: Props) {
  return (
    <Tabs defaultValue="general">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
        <TabsTrigger value="servicios" className="flex-1">Servicios</TabsTrigger>
        <TabsTrigger value="disponibilidad" className="flex-1">Disponibilidad</TabsTrigger>
        <TabsTrigger value="bloqueos" className="flex-1">Bloqueos</TabsTrigger>
      </TabsList>
      <TabsContent value="general"><SettingsSection settings={settings} /></TabsContent>
      <TabsContent value="servicios"><ServicesSection services={services} /></TabsContent>
      <TabsContent value="disponibilidad"><AvailabilitySection rules={rules} /></TabsContent>
      <TabsContent value="bloqueos"><BlocksSection blocks={blocks} /></TabsContent>
    </Tabs>
  );
}
