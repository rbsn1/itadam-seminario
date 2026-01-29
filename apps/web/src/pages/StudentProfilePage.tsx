import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Perfil do Aluno</h1>
          <p className="text-sm text-slate-500">Resumo geral e histórico acadêmico.</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700">Em dia</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm text-slate-500">Status Financeiro</div>
          <div className="text-xl font-semibold">Em dia</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Resumo de Presença</div>
          <div className="text-xl font-semibold">92% no módulo atual</div>
        </Card>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
          <TabsTrigger value="attendance">Presença</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <p className="text-sm text-slate-500">Dados cadastrais do aluno.</p>
          </Card>
        </TabsContent>
        <TabsContent value="enrollments">
          <Card>
            <p className="text-sm text-slate-500">Histórico de matrículas.</p>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <p className="text-sm text-slate-500">Lista de presenças por módulo.</p>
          </Card>
        </TabsContent>
        <TabsContent value="finance">
          <Card>
            <p className="text-sm text-slate-500">Resumo financeiro (somente leitura para secretaria).</p>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <p className="text-sm text-slate-500">Uploads de documentos do aluno.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
