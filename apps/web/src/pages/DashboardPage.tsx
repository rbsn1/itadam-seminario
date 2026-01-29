import { Card } from "../components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Total de alunos</div>
          <div className="text-2xl font-semibold">120</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Recebido no mês</div>
          <div className="text-2xl font-semibold">R$ 45.000</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Aulas hoje</div>
          <div className="text-2xl font-semibold">8</div>
        </Card>
      </div>
    </div>
  );
}
