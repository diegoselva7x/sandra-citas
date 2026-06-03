import { Link, Text } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface CancellationEmailProps {
  name: string;
  fecha: string;
  siteUrl: string;
  whatsapp?: string | null;
}

export function CancellationEmail({ name, fecha, siteUrl, whatsapp }: CancellationEmailProps) {
  return (
    <BaseEmail
      preview="Tu cita fue cancelada"
      siteUrl={siteUrl}
      whatsapp={whatsapp}
    >
      <Text style={styles.h1}>Tu cita fue cancelada</Text>
      <Text style={styles.p}>
        Hola {name}, confirmamos que la cita del{" "}
        <strong>{fecha}</strong> fue cancelada.
      </Text>
      <Text style={styles.p}>
        Cuando estés lista/o, podés reservar una nueva cita en el momento que
        mejor te quede.
      </Text>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <Link href={`${siteUrl}/reservar`} style={styles.button}>
          Reservar una nueva cita
        </Link>
      </div>
      <Text style={styles.pMuted}>
        Si tenés alguna consulta, no dudes en escribirnos.
      </Text>
    </BaseEmail>
  );
}
