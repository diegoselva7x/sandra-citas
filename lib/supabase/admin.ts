// Cliente con SERVICE ROLE: salta RLS por completo.
// ⚠️ SOLO en el servidor (crons, webhooks, tareas internas).
// NUNCA lo importes en un componente "use client" ni expongas la key.
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
