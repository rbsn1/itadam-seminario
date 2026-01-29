import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

export type Student = {
  id: string;
  name: string;
  email?: string | null;
  document?: string | null;
  status: "em_dia" | "pendente";
};

export function StudentsTable({ students }: { students: Student[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aluno</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Status Financeiro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email ?? "-"}</TableCell>
            <TableCell>{student.document ?? "-"}</TableCell>
            <TableCell>
              <Badge className={student.status === "em_dia" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                {student.status === "em_dia" ? "Em dia" : "Pendente"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
