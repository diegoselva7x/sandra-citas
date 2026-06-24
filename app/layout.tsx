import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicologasandra.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Sandra Carpio · Psicóloga en Costa Rica",
    template: "%s · Sandra Carpio Psicóloga",
  },
  description:
    "Psicóloga en Costa Rica especialista en EMDR y trauma. Terapia individual, de pareja y familiar, presencial y virtual. Agendá hoy.",
  keywords: [
    "psicóloga Costa Rica",
    "psicoterapia",
    "terapia individual",
    "terapia de pareja",
    "terapia familiar",
    "EMDR",
    "trauma",
    "ansiedad",
    "psicóloga online",
    "Cartago",
  ],
  authors: [{ name: "Sandra Carpio Monge" }],
  creator: "Sandra Carpio Monge",
  publisher: "Sandra Carpio Monge",
  category: "Salud y bienestar",
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: SITE,
    siteName: "Sandra Carpio Psicóloga",
    title: "Sandra Carpio · Psicóloga en Costa Rica",
    description:
      "Psicóloga en Costa Rica especialista en EMDR y trauma. Terapia individual, de pareja y familiar, presencial y virtual.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sandra Carpio · Psicóloga en Costa Rica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandra Carpio · Psicóloga en Costa Rica",
    description: "Agendá tu cita en línea. Atención presencial y virtual en Costa Rica.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:shadow-md"
        >
          Saltar al contenido
        </a>
        <Header />
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
