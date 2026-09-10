import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin incrementalCache a propósito.
//
// La plantilla por defecto de OpenNext monta un bucket R2 para el caché
// incremental, que sólo hace falta si hay ISR o revalidateTag. Este proyecto no
// tiene ninguno de los dos: el layout raíz lee la sesión, así que todas las
// páginas se renderizan por request, y los datos de Supabase se deduplican
// dentro del render con cache() de React.
//
// Si en algún momento se agrega una página con `export const revalidate`, hay
// que crear el bucket y volver a poner `incrementalCache: r2IncrementalCache`.
export default defineCloudflareConfig();
