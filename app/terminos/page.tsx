import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Términos y condiciones de uso del sitio web de Sandra Carpio, psicóloga.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <main className="flex flex-col">
      <BreadcrumbJsonLd items={[{ name: "Términos de uso", path: "/terminos" }]} />
      <PageHeader
        title="Términos de uso"
        subtitle="Última actualización: mayo de 2026"
      />

      <Section>
        <div className="max-w-2xl mx-auto space-y-10 text-muted-foreground leading-relaxed">

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Aceptación de los términos</h2>
            <p>
              Al acceder y usar este sitio web, usted acepta estos términos de uso en su
              totalidad. Si no está de acuerdo con alguna parte, le pedimos que no use el sitio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Descripción del servicio</h2>
            <p>
              Este sitio facilita la reserva en línea de citas con Sandra Carpio, psicóloga
              colegiada en Costa Rica. No reemplaza la relación terapéutica ni constituye
              un servicio de emergencias de salud mental.
            </p>
            <p>
              <strong className="text-foreground">En caso de emergencia</strong>, comuníquese
              con el servicio de emergencias nacional (911) o acuda al centro de salud más cercano.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Registro y cuenta</h2>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Debe ser mayor de 18 años para registrarse de forma independiente.",
                "Es responsable de mantener la confidencialidad de su contraseña.",
                "Debe proporcionar información veraz al registrarse.",
                "Una cuenta es de uso personal e intransferible.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Reservas y cancelaciones</h2>
            <ul className="space-y-1.5 list-none pl-0">
              {[
                "Las reservas quedan confirmadas una vez recibido el correo de confirmación.",
                "Para cancelar o reagendar, use su panel \"Mi cuenta\" con la anticipación que indique la profesional.",
                "La profesional se reserva el derecho de cancelar o reprogramar citas en casos justificados.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Tarifas y pagos</h2>
            <p>
              Las tarifas de cada servicio se muestran en la página de Servicios. El pago
              se coordina directamente con la profesional según el método acordado. Este sitio
              no procesa pagos en línea.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Confidencialidad</h2>
            <p>
              Toda información compartida en el contexto de las sesiones está sujeta al secreto
              profesional conforme a la legislación costarricense y al código de ética del
              Colegio de Profesionales en Psicología de Costa Rica.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Propiedad intelectual</h2>
            <p>
              Todo el contenido de este sitio (textos, diseño, imágenes) es propiedad de
              Sandra Carpio y está protegido por las leyes de propiedad intelectual. No está
              permitida su reproducción sin autorización expresa.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Limitación de responsabilidad</h2>
            <p>
              Este sitio se ofrece «tal cual». No garantizamos disponibilidad ininterrumpida
              y no somos responsables por daños derivados del uso del sitio más allá de lo
              permitido por la legislación costarricense aplicable.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">9. Ley aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier
              controversia se someterá a los tribunales competentes del país.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">10. Cambios</h2>
            <p>
              Podemos modificar estos términos en cualquier momento. La versión vigente
              siempre estará disponible en esta página.
            </p>
          </div>

        </div>
      </Section>
    </main>
  );
}
