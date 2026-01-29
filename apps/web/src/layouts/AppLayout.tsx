import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/students", label: "Alunos" },
  { to: "/classes", label: "Turmas" },
  { to: "/modules", label: "Módulos" },
  { to: "/lessons", label: "Aulas/Presença" },
  { to: "/finance", label: "Financeiro" },
  { to: "/reports", label: "Relatórios" },
  { to: "/users", label: "Usuários" }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-4">
        <div className="text-2xl font-semibold">ITADAM</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div className="text-sm text-slate-500">Bem-vindo, {user?.name}</div>
          <button onClick={logout} className="text-sm text-red-500">
            Sair
          </button>
        </header>
        <main className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
