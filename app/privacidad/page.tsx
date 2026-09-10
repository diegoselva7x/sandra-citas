import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el tratamiento de datos personales conforme a la Ley 8968 de Costa Rica.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <main className="flex flex-col">
      <BreadcrumbJsonLd items={[{ name: "Política de privacidad", path: "/privacidad" }]} />
      <PageHeader
        title="Política de privacidad"
        subtitle="Última actualización: mayo de 2026"
      />

      <Section>
        <div className="max-w-2xl mx-auto space-y-10 text-muted-foreground leading-relaxed">

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Responsable del tratamiento</h2>
            <p>
              La responsable del tratamiento de los datos personales es{" "}
              <strong className="text-foreground">Sandra Carpio</strong>, psicóloga
              colegiada en Costa Rica. Para cualquier consulta relacionada con sus datos
              podés escribirnos a través del{" "}
              <Link href="/contacto" className="text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors">formulario de contacto</Link>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Datos que recopilamos</h2>
            <p>Al crear una cuenta y usar este sitio recopilamos los siguientes datos:</p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Nombre completo",
                "Dirección de correo electrónico",
                "Número de teléfono",
                "Historial de citas (fecha, servicio, modalidad, estado)",
                "Notas de sesión ingresadas por la profesional (de uso exclusivo clínico)",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              No recopilamos información de tarjetas de crédito ni datos de pago a través
              de este sitio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Finalidad del tratamiento</h2>
            <p>Sus datos se utilizan únicamente para:</p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Gestionar su cuenta y el proceso de reserva de citas",
                "Enviar confirmaciones, recordatorios y notificaciones sobre su cita",
                "Permitir que la profesional lleve un registro del historial de atención",
                "Cumplir obligaciones legales aplicables",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>No utilizamos sus datos para publicidad ni los cedemos a terceros con fines comerciales.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Base legal del tratamiento</h2>
            <p>
              El tratamiento de sus datos se fundamenta en el consentimiento que usted otorga
              al momento de registrarse, conforme a la{" "}
              <strong className="text-foreground">Ley N.° 8968 — Protección de la Persona frente al
              Tratamiento de sus Datos Personales</strong> de Costa Rica y su reglamento.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Proveedores de servicios</h2>
            <p>
              Para operar el sitio utilizamos los siguientes proveedores que pueden procesar
              sus datos únicamente en nuestro nombre:
            </p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Supabase Inc. — almacenamiento de base de datos (servidores en Estados Unidos)",
                "Resend Inc. — envío de correos transaccionales",
                "Vercel Inc. — alojamiento de la aplicación web",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Estos proveedores están sujetos a sus propias políticas de privacidad y cuentan
              con medidas de seguridad adecuadas.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Plazo de conservación</h2>
            <p>
              Sus datos se conservan mientras su cuenta esté activa. Si solicita la eliminación
              de su cuenta, los datos serán suprimidos en un plazo máximo de 30 días hábiles,
              salvo obligación legal de conservarlos por más tiempo.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Sus derechos (ARCO)</h2>
            <p>Conforme a la Ley 8968, usted tiene derecho a:</p>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Acceso: conocer qué datos personales tenemos sobre usted",
                "Rectificación: corregir datos inexactos o incompletos",
                "Cancelación/Supresión: solicitar la eliminación de sus datos",
                "Oposición: oponerse al tratamiento en casos justificados",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, escribinos a través del{" "}
              <Link href="/contacto" className="text-foreground underline underline-offset-4 decoration-primary hover:text-foreground/70 transition-colors">formulario de contacto</Link>.
              Respondemos en un plazo máximo de 5 días hábiles.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger sus datos contra
              acceso no autorizado, pérdida o alteración. Las contraseñas se almacenan
              cifradas y nunca en texto plano.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">9. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política cuando sea necesario. Le notificaremos
              cualquier cambio relevante por correo electrónico. La fecha de última
              actualización aparece al inicio de este documento.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">10. Autoridad de control</h2>
            <p>
              En Costa Rica, la autoridad de protección de datos personales es la{" "}
              <strong className="text-foreground">Agencia de Protección de Datos de los Habitantes
              (PRODHAB)</strong>. Si considera que sus derechos no han sido respetados, puede
              presentar una reclamación ante dicho organismo.
            </p>
          </div>

        </div>
      </Section>
    </main>
  );
}
