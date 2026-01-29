import { Card } from "../components/ui/card";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Financeiro</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Recebido</div>
          <div className="text-2xl font-semibold">R$ 18.000</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Em aberto</div>
          <div className="text-2xl font-semibold">R$ 6.500</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Atrasado</div>
          <div className="text-2xl font-semibold">R$ 2.100</div>
        </Card>
      </div>
      <Card>
        <div className="flex gap-3">
          <select className="rounded border px-3 py-2 text-sm">
            <option>Turma</option>
          </select>
          <select className="rounded border px-3 py-2 text-sm">
            <option>Competência</option>
          </select>
        </div>
      </Card>
    </div>
  );
}
