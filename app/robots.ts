import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const SITE = SITE_URL;

// Rutas privadas que ningún bot debe indexar
const DISALLOW = ["/admin", "/mi-cuenta", "/reservar", "/api"];

// Bots de motores de IA: se permite el acceso (objetivo GEO — aparecer en
// ChatGPT, Perplexity, Gemini, AI Overviews y Claude).
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
