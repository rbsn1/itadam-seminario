import { Card } from "../components/ui/card";

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Aulas & Presença</h1>
      <Card>
        <p className="text-sm text-slate-500">Registre aulas e presenças por módulo.</p>
      </Card>
    </div>
  );
}
