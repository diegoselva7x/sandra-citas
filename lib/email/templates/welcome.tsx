import { Link, Text } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface WelcomeEmailProps {
  name: string;
  siteUrl: string;
  whatsapp?: string | null;
}

export function WelcomeEmail({ name, siteUrl, whatsapp }: WelcomeEmailProps) {
  return (
    <BaseEmail
      preview="Tu cuenta está lista"
      siteUrl={siteUrl}
      whatsapp={whatsapp}
    >
      <Text style={styles.h1}>¡Hola, {name}!</Text>
      <Text style={styles.p}>
        Tu cuenta fue creada con éxito. Ya podés ingresar y reservar tu primera
        cita cuando quieras.
      </Text>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <Link href={`${siteUrl}/reservar`} style={styles.button}>
          Reservar mi primera cita
        </Link>
      </div>
      <Text style={styles.pMuted}>
        Si tenés alguna duda antes de reservar, podés escribirnos sin problema.
        Estamos para acompañarte.
      </Text>
    </BaseEmail>
  );
}
