import { Link, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface ReminderEmailProps {
  name: string;
  fecha: string;
  modality: "online" | "in_person";
  onlineInstructions?: string | null;
  siteUrl: string;
  whatsapp?: string | null;
}

export function ReminderEmail({
  name,
  fecha,
  modality,
  onlineInstructions,
  siteUrl,
  whatsapp,
}: ReminderEmailProps) {
  const wa = whatsapp?.replace(/\D/g, "");

  return (
    <BaseEmail
      preview="Recordatorio de tu cita de mañana"
      siteUrl={siteUrl}
      whatsapp={whatsapp}
    >
      <Text style={styles.h1}>Tu cita es mañana</Text>
      <Text style={styles.p}>
        Hola {name}, te recordamos que tenés una cita para:
      </Text>

      <div style={styles.badge}>{fecha}</div>

      <Text style={{ ...styles.p, margin: "0 0 8px" }}>
        <strong>Modalidad:</strong>{" "}
        {modality === "online" ? "Virtual (videollamada)" : "Presencial"}
      </Text>

      {modality === "online" && (
        <Text style={styles.pMuted}>
          {onlineInstructions ??
            "Sandra te enviará el enlace de la videollamada por WhatsApp pronto."}
          {wa && (
            <>
              {" "}
              <Link href={`https://wa.me/${wa}`} style={{ color: styles.brand }}>
                WhatsApp
              </Link>
            </>
          )}
        </Text>
      )}

      <Hr style={{ borderColor: "#e8e3dd", margin: "20px 0" }} />

      <Text style={{ ...styles.pMuted, margin: 0 }}>
        Si no podés asistir, avisanos con tiempo desde{" "}
        <Link href={`${siteUrl}/mi-cuenta`} style={{ color: styles.brand }}>
          tu cuenta
        </Link>
        .
      </Text>
    </BaseEmail>
  );
}
