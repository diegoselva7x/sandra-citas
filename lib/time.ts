import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { TIMEZONE } from "@/lib/types";

/**
 * Utilidades de fecha ancladas a la hora de Costa Rica.
 *
 * Todo en la base se guarda como `timestamptz` (UTC). El servidor corre en UTC,
 * así que `setHours(0,0,0,0)` sobre un `new Date()` da la medianoche de Londres,
 * no la de Cartago — un desfase de 6 horas en cualquier cálculo de "hoy".
 * Estas funciones devuelven siempre el instante UTC que corresponde a la hora
 * civil costarricense.
 */

/** Fecha civil en Costa Rica, como "yyyy-MM-dd". */
function fechaCivilCR(ref: Date): string {
  return formatInTimeZone(ref, TIMEZONE, "yyyy-MM-dd");
}

/** Instante UTC de la medianoche costarricense del día de `ref`. */
export function inicioDelDiaCR(ref: Date = new Date()): Date {
  return fromZonedTime(`${fechaCivilCR(ref)} 00:00:00`, TIMEZONE);
}

/** Instante UTC del último milisegundo del día costarricense de `ref`. */
export function finDelDiaCR(ref: Date = new Date()): Date {
  return fromZonedTime(`${fechaCivilCR(ref)} 23:59:59.999`, TIMEZONE);
}

/** Instante UTC del domingo a medianoche de la semana costarricense de `ref`. */
export function inicioDeSemanaCR(ref: Date = new Date()): Date {
  const [anio, mes, dia] = fechaCivilCR(ref).split("-").map(Number);
  // Se construye la fecha civil como medianoche UTC para poder usar getUTCDay
  // sin que ninguna zona la corra de día.
  const civil = new Date(Date.UTC(anio, mes - 1, dia));
  civil.setUTCDate(civil.getUTCDate() - civil.getUTCDay()); // retrocede al domingo
  return fromZonedTime(`${civil.toISOString().slice(0, 10)} 00:00:00`, TIMEZONE);
}

/** Instante UTC del sábado a las 23:59:59.999 de la semana costarricense de `ref`. */
export function finDeSemanaCR(ref: Date = new Date()): Date {
  const inicio = inicioDeSemanaCR(ref);
  const sabado = new Date(inicio);
  sabado.setUTCDate(sabado.getUTCDate() + 6);
  return finDelDiaCR(sabado);
}

/** Horas que faltan para `iso`. Negativo si ya pasó. */
export function horasHasta(iso: string, desde: Date = new Date()): number {
  return (new Date(iso).getTime() - desde.getTime()) / 3_600_000;
}

/** Antelación mínima para que un paciente cancele o reagende por su cuenta. */
export const HORAS_MINIMAS_CANCELACION = 12;

/** ¿La cita ya entró en la ventana en la que el paciente no puede cancelar solo? */
export function esCancelacionTardia(startsAt: string, desde: Date = new Date()): boolean {
  return horasHasta(startsAt, desde) < HORAS_MINIMAS_CANCELACION;
}
