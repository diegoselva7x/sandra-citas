import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Ingresá tu nombre completo"),
  email: z.string().email("Correo inválido"),
  phone: z
    .string()
    .min(8, "Teléfono inválido")
    .regex(/^[0-9+\-\s()]+$/, "Teléfono inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número"),
});

export const signInSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const bookAppointmentSchema = z.object({
  serviceTypeId: z.string().uuid().optional(),
  startsAt: z.string().datetime({ message: "Fecha inválida", offset: true }), // ISO 8601 UTC o con offset
  modality: z.enum(["online", "in_person"]),
  clientMessage: z.string().max(500).optional(),
});

export const rescheduleSchema = z.object({
  appointmentId: z.string().uuid(),
  newStartsAt: z.string().datetime({ offset: true }),
});

export const cancelSchema = z.object({
  appointmentId: z.string().uuid(),
  reason: z.string().max(300).optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Ingresá tu nombre completo"),
  phone: z
    .string()
    .min(8, "Teléfono inválido")
    .regex(/^[0-9+\-\s()]+$/, "Teléfono inválido"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
