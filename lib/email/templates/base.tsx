// Layout base compartido por todos los correos de Sandra.
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

const BRAND = "#6d6875"; // tono cálido principal
const BG = "#faf9f7";
const CARD = "#ffffff";
const TEXT = "#3d3d3d";
const MUTED = "#888";

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
  siteUrl: string;
  whatsapp?: string | null;
}

export function BaseEmail({ preview, children, siteUrl, whatsapp }: BaseEmailProps) {
  const wa = whatsapp?.replace(/\D/g, "");

  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 16px" }}>

          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: 24 }}>
            <Img
              src={`${siteUrl}/logo.png`}
              alt="Sandra Carpio"
              width={48}
              height={48}
              style={{ margin: "0 auto 8px", display: "block" }}
            />
            <Text style={{ fontSize: 20, fontWeight: 600, color: BRAND, margin: 0 }}>
              Sandra Carpio
            </Text>
            <Text style={{ fontSize: 13, color: MUTED, margin: "2px 0 0" }}>
              Psicóloga · Costa Rica
            </Text>
          </Section>

          {/* Card */}
          <Section style={{
            backgroundColor: CARD,
            borderRadius: 12,
            padding: "32px 32px",
            border: "1px solid #e8e3dd",
          }}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: 24, textAlign: "center" }}>
            <Hr style={{ borderColor: "#e8e3dd", margin: "0 0 16px" }} />
            {wa && (
              <Text style={{ fontSize: 12, color: MUTED, margin: "0 0 4px" }}>
                WhatsApp:{" "}
                <Link href={`https://wa.me/${wa}`} style={{ color: BRAND }}>
                  {whatsapp}
                </Link>
              </Text>
            )}
            <Text style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
              © {new Date().getFullYear()} Sandra Carpio. Todos los derechos reservados.
              {" "}·{" "}
              <Link href={`${siteUrl}/privacidad`} style={{ color: "#aaa" }}>
                Privacidad
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// Helpers de estilo reutilizables
export const styles = {
  brand: BRAND,
  text: TEXT,
  muted: MUTED,
  h1: {
    fontSize: 22,
    fontWeight: 600,
    color: TEXT,
    margin: "0 0 12px",
    lineHeight: 1.3,
  } as React.CSSProperties,
  p: {
    fontSize: 15,
    color: TEXT,
    lineHeight: 1.6,
    margin: "0 0 16px",
  } as React.CSSProperties,
  pMuted: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 1.6,
    margin: "0 0 16px",
  } as React.CSSProperties,
  button: {
    display: "inline-block",
    backgroundColor: BRAND,
    color: "#fff",
    borderRadius: 8,
    padding: "12px 28px",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    backgroundColor: "#f0ede8",
    borderRadius: 6,
    padding: "10px 16px",
    margin: "4px 0 16px",
    fontSize: 14,
    color: TEXT,
    fontWeight: 500,
  } as React.CSSProperties,
};
