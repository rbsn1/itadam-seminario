import { Card } from "../components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <Card>
        <p className="text-sm text-slate-500">Cadastro e gestão de usuários com perfis.</p>
      </Card>
    </div>
  );
}
