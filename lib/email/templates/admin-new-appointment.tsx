import { Link, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseEmail, styles } from "./base";

interface AdminNewAppointmentProps {
  clientName: string;
  clientEmail: string;
  fecha: string;
  modality: "online" | "in_person";
  siteUrl: string;
}

export function AdminNewAppointmentEmail({
  clientName,
  clientEmail,
  fecha,
  modality,
  siteUrl,
}: AdminNewAppointmentProps) {
  return (
    <BaseEmail
      preview={`Nueva cita: ${clientName}`}
      siteUrl={siteUrl}
    >
      <Text style={styles.h1}>Nueva cita agendada</Text>

      <div style={{ ...styles.badge, width: "100%", boxSizing: "border-box" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", color: styles.muted, fontSize: 13, width: 100 }}>Cliente</td>
              <td style={{ padding: "4px 0", fontWeight: 600, fontSize: 14 }}>{clientName}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: styles.muted, fontSize: 13 }}>Email</td>
              <td style={{ padding: "4px 0", fontSize: 14 }}>{clientEmail}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: styles.muted, fontSize: 13 }}>Fecha</td>
              <td style={{ padding: "4px 0", fontSize: 14 }}>{fecha}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: styles.muted, fontSize: 13 }}>Modalidad</td>
              <td style={{ padding: "4px 0", fontSize: 14 }}>
                {modality === "online" ? "Virtual" : "Presencial"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Hr style={{ borderColor: "#e8e3dd", margin: "20px 0" }} />

      <div style={{ textAlign: "center" }}>
        <Link href={`${siteUrl}/admin/citas`} style={styles.button}>
          Ver en el panel
        </Link>
      </div>
    </BaseEmail>
  );
}
