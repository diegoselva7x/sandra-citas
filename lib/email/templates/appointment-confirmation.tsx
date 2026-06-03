import { Link, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface AppointmentConfirmationProps {
  name: string;
  fecha: string;
  modality: "online" | "in_person";
  onlineInstructions?: string | null;
  rescheduled?: boolean;
  siteUrl: string;
  whatsapp?: string | null;
}

export function AppointmentConfirmationEmail({
  name,
  fecha,
  modality,
  onlineInstructions,
  rescheduled = false,
  siteUrl,
  whatsapp,
}: AppointmentConfirmationProps) {
  const wa = whatsapp?.replace(/\D/g, "");

  return (
    <BaseEmail
      preview={rescheduled ? "Tu cita fue reagendada" : "Confirmación de tu cita"}
      siteUrl={siteUrl}
      whatsapp={whatsapp}
    >
      <Text style={styles.h1}>
        {rescheduled ? "¡Tu cita fue reagendada!" : "¡Tu cita está confirmada!"}
      </Text>

      <Text style={styles.p}>
        Hola {name}, {rescheduled ? "tu cita quedó reagendada" : "tu cita quedó reservada"} para:
      </Text>

      <div style={styles.badge}>{fecha}</div>

      <Text style={{ ...styles.p, margin: "0 0 8px" }}>
        <strong>Modalidad:</strong>{" "}
        {modality === "online" ? "Virtual (videollamada)" : "Presencial"}
      </Text>

      {modality === "online" && (
        <Text style={styles.pMuted}>
          {onlineInstructions ??
            "Sandra te enviará el enlace de la videollamada por WhatsApp uno o dos días antes de tu cita."}
          {wa && (
            <>
              {" "}
              <Link href={`https://wa.me/${wa}`} style={{ color: styles.brand }}>
                Escribir por WhatsApp
              </Link>
            </>
          )}
        </Text>
      )}

      {modality === "in_person" && (
        <Text style={styles.pMuted}>
          La cita es en el consultorio. Si necesitás la dirección o tenés alguna
          duda, no dudes en escribirnos.
        </Text>
      )}

      <Hr style={{ borderColor: "#e8e3dd", margin: "20px 0" }} />

      <Text style={{ ...styles.pMuted, margin: 0 }}>
        ¿Necesitás cambiar o cancelar?{" "}
        <Link href={`${siteUrl}/mi-cuenta`} style={{ color: styles.brand }}>
          Gestioná tu cita desde tu cuenta
        </Link>
        .
      </Text>
    </BaseEmail>
  );
}
