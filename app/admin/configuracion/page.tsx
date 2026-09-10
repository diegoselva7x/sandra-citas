import {
  getAdminSettings,
  getAllServiceTypes,
  getAvailabilityRules,
  getDateBlocks,
} from "@/app/admin/actions";
import { ConfigClient } from "@/components/admin/config-client";

export default async function ConfiguracionPage() {
  const [settings, services, rules, blocks] = await Promise.all([
    getAdminSettings(),
    getAllServiceTypes(),
    getAvailabilityRules(),
    getDateBlocks(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Configuración</h1>
      <ConfigClient
        settings={settings!}
        services={services}
        rules={rules as AvailabilityRule[]}
        blocks={blocks as DateBlock[]}
      />
    </div>
  );
}

// Tipos locales para los datos del servidor
interface AvailabilityRule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface DateBlock {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}
