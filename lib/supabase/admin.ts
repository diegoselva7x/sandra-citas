// Cliente con SERVICE ROLE: salta RLS por completo.
// ⚠️ SOLO en el servidor (crons, webhooks, tareas internas).
// NUNCA lo importes en un componente "use client" ni expongas la key.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/**
 * Devuelve el cliente de service role, creándolo la primera vez que se usa.
 *
 * Antes esto se construía al importar el módulo. `createClient` lanza si la key
 * viene vacía, así que cualquier build sin `SUPABASE_SERVICE_ROLE_KEY` en el
 * entorno reventaba al recolectar las páginas — obligando a exponer un secreto
 * de runtime dentro del contenedor de build. Difiriéndolo, el secreto sólo hace
 * falta cuando de verdad se va a hablar con la base.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.",
    );
  }

  cliente = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
