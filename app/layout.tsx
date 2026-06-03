import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicologasandra.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Sandra Carpio · Psicóloga",
    template: "%s · Sandra Carpio Psicóloga",
  },
  description:
    "Agenda tu cita de psicología en línea. Atención individual, de pareja y familiar. Modalidad presencial y virtual en Costa Rica.",
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: SITE,
    siteName: "Sandra Carpio Psicóloga",
    title: "Sandra Carpio · Psicóloga",
    description:
      "Agenda tu cita de psicología en línea. Atención individual, de pareja y familiar en Costa Rica.",
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
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
