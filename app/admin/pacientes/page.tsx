import { getPatients } from "@/app/admin/actions";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const patients = await getPatients(q);

  return (
    <div className="p-6 max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold">Pacientes</h1>

      <form>
        <Input
          name="q"
          placeholder="Buscar por nombre, email o teléfono…"
          defaultValue={q ?? ""}
          className="max-w-sm"
        />
      </form>

      {patients.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            {q ? "No se encontraron pacientes." : "Aún no hay pacientes registrados."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border divide-y overflow-hidden">
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/admin/pacientes/${p.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                {p.phone && (
                  <p className="text-xs text-muted-foreground">{p.phone}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {p.appointment_count} cita{p.appointment_count !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
