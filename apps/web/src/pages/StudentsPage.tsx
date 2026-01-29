import { useState } from "react";
import { StudentsTable, Student } from "../components/StudentsTable";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";

const seedStudents: Student[] = [
  { id: "1", name: "Maria Silva", email: "maria@aluno.local", document: "123.456.789-00", status: "em_dia" },
  { id: "2", name: "João Souza", email: "joao@aluno.local", document: "987.654.321-00", status: "pendente" }
];

export default function StudentsPage() {
  const [students] = useState(seedStudents);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Alunos</h1>
        <Dialog>
          <DialogTrigger className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Novo aluno</DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold">Cadastrar aluno</h2>
            <p className="text-sm text-slate-500">Formulário simplificado para o MVP.</p>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Buscar por nome, email ou documento" />
            <select className="rounded border px-3 py-2 text-sm">
              <option>Turma</option>
            </select>
          </div>
          <StudentsTable students={students} />
        </div>
      </Card>
    </div>
  );
}
