// Modal para que Sandra cargue una cita a mano (los que agendan por WhatsApp).
//
// A diferencia del flujo del paciente, acá NO se usa StepSchedule: ese componente
// arranca en el día siguiente y sólo ofrece horarios dentro de availability_rules.
// Sandra necesita justo lo contrario — poder meter una cita para hoy, o a una hora
// fuera de su horario publicado, porque para eso la coordinó por WhatsApp.
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { createManualAppointment, getPatients, createPatient } from "@/app/admin/actions";
import type { ServiceType, AppointmentModality } from "@/lib/types";
import { TIMEZONE } from "@/lib/types";
import type { PatientWithCount } from "@/app/admin/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  services: ServiceType[];
  open: boolean;
  onClose: () => void;
}

type Paso = "paciente" | "horario" | "confirmar";
type ModoPaciente = "buscar" | "crear";

/** Fecha de hoy en Costa Rica, lista para un <input type="date">. */
function hoyEnCR(): string {
  return formatInTimeZone(new Date(), TIMEZONE, "yyyy-MM-dd");
}

/** Contraseña legible y fácil de dictar por WhatsApp. */
function sugerirContrasena(): string {
  const palabras = ["sol", "mar", "flor", "rio", "luz", "nube", "hoja", "cielo"];
  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `${palabra}${numero}`;
}

export function ManualAppointmentDialog({ services, open, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [paso, setPaso] = useState<Paso>("paciente");
  const [modo, setModo] = useState<ModoPaciente>("buscar");

  // Buscar paciente existente
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<PatientWithCount[]>([]);
  const [paciente, setPaciente] = useState<PatientWithCount | null>(null);

  // Crear paciente nuevo
  const [nuevo, setNuevo] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: sugerirContrasena(),
  });

  // Datos de la cita
  const [servicioId, setServicioId] = useState(services[0]?.id ?? "");
  const [modalidad, setModalidad] = useState<AppointmentModality>("in_person");
  const [fecha, setFecha] = useState(hoyEnCR());
  const [hora, setHora] = useState("09:00");

  const [error, setError] = useState<string | null>(null);

  const servicio = services.find((s) => s.id === servicioId);

  const buscar = (q: string) => {
    setBusqueda(q);
    if (q.trim().length < 2) {
      setResultados([]);
      return;
    }
    startTransition(async () => {
      setResultados(await getPatients(q));
    });
  };

  const guardarPacienteNuevo = () => {
    setError(null);
    startTransition(async () => {
      const r = await createPatient(nuevo);
      if (r.error) {
        setError(r.error);
        return;
      }
      if (r.patient) {
        setPaciente(r.patient);
        setPaso("horario");
      }
    });
  };

  /** El instante en UTC que corresponde a la fecha y hora escritas, en hora de CR. */
  const startsAt = (() => {
    if (!fecha || !hora) return null;
    try {
      return fromZonedTime(`${fecha} ${hora}:00`, TIMEZONE).toISOString();
    } catch {
      return null;
    }
  })();

  const crearCita = () => {
    if (!paciente || !startsAt) return;
    setError(null);
    startTransition(async () => {
      const r = await createManualAppointment({
        clientId: paciente.id,
        serviceTypeId: servicioId || undefined,
        startsAt,
        modality: modalidad,
      });
      if (r.error) {
        setError(r.error);
        return;
      }
      cerrar();
      router.refresh();
    });
  };

  const reiniciar = () => {
    setPaso("paciente");
    setModo("buscar");
    setBusqueda("");
    setResultados([]);
    setPaciente(null);
    setNuevo({ fullName: "", email: "", phone: "", password: sugerirContrasena() });
    setFecha(hoyEnCR());
    setHora("09:00");
    setError(null);
  };

  const cerrar = () => {
    onClose();
    reiniciar();
  };

  const mensajeError = error && (
    <p className="rounded-md bg-destructive/10 px-3 py-2 text-destructive">{error}</p>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && cerrar()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
        </DialogHeader>

        {/* ---------------------------- PASO 1 ---------------------------- */}
        {paso === "paciente" && (
          <div className="space-y-5">
            <div className="flex gap-2">
              {(
                [
                  ["buscar", "Ya es paciente"],
                  ["crear", "Es nuevo"],
                ] as const
              ).map(([valor, etiqueta]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setModo(valor);
                    setError(null);
                  }}
                  className={`flex-1 rounded-md border py-3 font-medium transition-colors ${
                    modo === valor ? "border-primary bg-accent/60" : "hover:bg-accent/30"
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>

            {modo === "buscar" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="buscar-paciente">Buscar por nombre, correo o teléfono</Label>
                  <Input
                    id="buscar-paciente"
                    placeholder="Escribí al menos 2 letras…"
                    value={busqueda}
                    onChange={(e) => buscar(e.target.value)}
                  />
                </div>

                {resultados.length > 0 && (
                  <div className="max-h-56 divide-y overflow-y-auto rounded-md border">
                    {resultados.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full px-4 py-3 text-left transition-colors hover:bg-accent"
                        onClick={() => {
                          setPaciente(p);
                          setResultados([]);
                          setBusqueda(p.full_name);
                          setPaso("horario");
                        }}
                      >
                        <p className="font-medium">{p.full_name}</p>
                        <p className="text-muted-foreground">
                          {p.email}
                          {p.phone ? ` · ${p.phone}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {busqueda.trim().length >= 2 && resultados.length === 0 && !isPending && (
                  <p className="text-muted-foreground">
                    No aparece nadie con ese dato. Si es la primera vez que viene, tocá{" "}
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={() => setModo("crear")}
                    >
                      Es nuevo
                    </button>
                    .
                  </p>
                )}
              </div>
            )}

            {modo === "crear" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="np-nombre">Nombre completo</Label>
                  <Input
                    id="np-nombre"
                    value={nuevo.fullName}
                    onChange={(e) => setNuevo({ ...nuevo, fullName: e.target.value })}
                    placeholder="María González"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="np-tel">Teléfono</Label>
                  <Input
                    id="np-tel"
                    type="tel"
                    value={nuevo.phone}
                    onChange={(e) => setNuevo({ ...nuevo, phone: e.target.value })}
                    placeholder="8888-8888"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="np-correo">Correo electrónico</Label>
                  <Input
                    id="np-correo"
                    type="email"
                    value={nuevo.email}
                    onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                    placeholder="nombre@correo.com"
                  />
                  <p className="text-muted-foreground">
                    Ahí le llega la confirmación y el recordatorio de la cita.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="np-clave">Contraseña</Label>
                  <div className="flex gap-2">
                    <Input
                      id="np-clave"
                      value={nuevo.password}
                      onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNuevo({ ...nuevo, password: sugerirContrasena() })}
                    >
                      Otra
                    </Button>
                  </div>
                  <p className="text-muted-foreground">
                    Pasásela por WhatsApp. La cuenta queda activa de una vez, sin que tenga que
                    confirmar nada.
                  </p>
                </div>

                {mensajeError}

                <Button
                  className="w-full"
                  disabled={
                    isPending ||
                    !nuevo.fullName.trim() ||
                    !nuevo.email.trim() ||
                    !nuevo.phone.trim() ||
                    nuevo.password.length < 8
                  }
                  onClick={guardarPacienteNuevo}
                >
                  {isPending ? "Creando…" : "Crear paciente y seguir"}
                </Button>
              </div>
            )}

            {modo === "buscar" && mensajeError}
          </div>
        )}

        {/* ---------------------------- PASO 2 ---------------------------- */}
        {paso === "horario" && paciente && (
          <div className="space-y-5">
            <div className="rounded-md border bg-accent/30 px-4 py-3">
              <p className="font-medium">{paciente.full_name}</p>
              <p className="text-muted-foreground">{paciente.email}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="servicio">Servicio</Label>
              <select
                id="servicio"
                className="h-10 w-full rounded-md border bg-background px-3"
                value={servicioId}
                onChange={(e) => setServicioId(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Modalidad</Label>
              <div className="flex gap-2">
                {(
                  [
                    ["in_person", "Presencial"],
                    ["online", "Virtual"],
                  ] as const
                ).map(([valor, etiqueta]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setModalidad(valor)}
                    className={`flex-1 rounded-md border py-3 transition-colors ${
                      modalidad === valor ? "border-primary bg-accent/60" : "hover:bg-accent/30"
                    }`}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fecha">Día</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>
            </div>
            <p className="text-muted-foreground">
              Podés poner cualquier día y hora, aunque sea hoy o fuera de tu horario de atención.
            </p>

            {mensajeError}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setPaso("paciente")}>
                Volver
              </Button>
              <Button
                className="flex-1"
                disabled={!startsAt}
                onClick={() => {
                  setError(null);
                  setPaso("confirmar");
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* ---------------------------- PASO 3 ---------------------------- */}
        {paso === "confirmar" && paciente && startsAt && (
          <div className="space-y-5">
            <dl className="divide-y rounded-md border">
              {[
                ["Paciente", paciente.full_name],
                ["Servicio", servicio ? `${servicio.name} (${servicio.duration_minutes} min)` : "—"],
                ["Modalidad", modalidad === "in_person" ? "Presencial" : "Virtual"],
                [
                  "Cuándo",
                  formatInTimeZone(
                    new Date(startsAt),
                    TIMEZONE,
                    "EEEE d 'de' MMMM 'a las' h:mm a",
                    { locale: es },
                  ),
                ],
              ].map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">{etiqueta}</dt>
                  <dd className="text-right font-medium capitalize">{valor}</dd>
                </div>
              ))}
            </dl>

            <p className="text-muted-foreground">
              Al confirmar, le llega un correo con los datos de la cita.
            </p>

            {mensajeError}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setPaso("horario")}>
                Volver
              </Button>
              <Button className="flex-1" disabled={isPending} onClick={crearCita}>
                {isPending ? "Guardando…" : "Confirmar cita"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
