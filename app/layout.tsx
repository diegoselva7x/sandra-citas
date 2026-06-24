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
    default: "Sandra Carpio · Psicóloga",
    template: "%s · Sandra Carpio Psicóloga",
  },
  description:
    "Psicóloga y psicoterapeuta en Costa Rica. Enfoque integrativo con formación en trauma y certificación en EMDR. Terapia individual, de pareja y familiar, presencial y virtual. Agenda tu cita en línea.",
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: SITE,
    siteName: "Sandra Carpio Psicóloga",
    title: "Sandra Carpio · Psicóloga",
    description:
      "Psicóloga y psicoterapeuta en Costa Rica. Especialista en EMDR y trauma. Terapia individual, de pareja y familiar, presencial y virtual.",
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
    title: "Sandra Carpio · Psicóloga",
    description: "Agenda tu cita en línea. Atención presencial y virtual en Costa Rica.",
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
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
