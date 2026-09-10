// Bindings propios de este proyecto, sumados a los que declara
// @opennextjs/cloudflare (ASSETS, IMAGES, …).
declare global {
  interface CloudflareEnv {
    /** KV donde vive el estado del rate limiting. Ver lib/rate-limit.ts. */
    RATE_LIMIT?: KVNamespace;
  }
}

export {};
