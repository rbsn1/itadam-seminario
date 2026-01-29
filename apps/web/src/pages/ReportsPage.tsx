import { Card } from "../components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Relatórios</h1>
      <Card>
        <p className="text-sm text-slate-500">Relatórios de presença e desempenho por módulo.</p>
      </Card>
    </div>
  );
}
