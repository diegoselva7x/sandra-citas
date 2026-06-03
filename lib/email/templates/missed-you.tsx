import { Link, Text } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface MissedYouEmailProps {
  name: string;
  siteUrl: string;
  whatsapp?: string | null;
}

export function MissedYouEmail({ name, siteUrl, whatsapp }: MissedYouEmailProps) {
  return (
    <BaseEmail
      preview="Te extrañamos en tu sesión"
      siteUrl={siteUrl}
      whatsapp={whatsapp}
    >
      <Text style={styles.h1}>Te extrañamos, {name}</Text>
      <Text style={styles.p}>
        No pudimos vernos en tu cita. Sabemos que a veces la vida se complica y
        los planes cambian; no hay problema.
      </Text>
      <Text style={styles.p}>
        Cuando estés lista/o y quieras retomar, podés reservar una nueva cita en
        el momento que mejor te quede:
      </Text>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <Link href={`${siteUrl}/reservar`} style={styles.button}>
          Reservar una nueva cita
        </Link>
      </div>
      <Text style={styles.pMuted}>
        Si necesitás hablar antes de reservar, podés escribirnos sin compromiso.
      </Text>
    </BaseEmail>
  );
}
