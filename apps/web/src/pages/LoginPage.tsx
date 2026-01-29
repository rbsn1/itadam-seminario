import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Form, FormField } from "../components/ui/form";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const result = schema.safeParse(data);
    if (!result.success) {
      setError("Preencha os dados corretamente.");
      return;
    }

    try {
      await login(result.data.email, result.data.password);
      navigate("/");
    } catch (err) {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold mb-2">ITADAM Portal</h1>
        <p className="text-sm text-slate-500 mb-6">Faça login para continuar</p>
        <Form onSubmit={handleSubmit}>
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Senha" name="password" type="password" required />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button className="w-full rounded bg-slate-900 text-white py-2 text-sm">Entrar</button>
        </Form>
      </div>
    </div>
  );
}
