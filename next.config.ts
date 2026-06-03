import type { NextConfig } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicologasandra.com";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "*.supabase.co";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, // unsafe-eval necesario para Next.js
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // Evita que el sitio sea embebido en iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Evita que el browser infiera el MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Protección XSS legacy (browsers antiguos)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // No enviar referrer a otros dominios
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deshabilitar features innecesarias
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // HSTS: forzar HTTPS por 1 año (solo en prod)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // CSP
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  // Headers de seguridad en todas las respuestas
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Logging mínimo en producción (no exponer stack traces en responses)
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Imágenes: dominios permitidos (agregar el CDN de fotos si se usa)
  images: {
    remotePatterns: [],
  },

  // Suprimir el header X-Powered-By: Next.js
  poweredByHeader: false,

  // Compresión de respuestas
  compress: true,
};

export default nextConfig;
