# ITADAM Portal

Monorepo fullstack (SaaS) com **Frontend** e **Backend**, pronto para rodar localmente via Docker Compose.

## Stack
- **Frontend:** Vite + React + TypeScript + Tailwind + shadcn/ui + React Router
- **Backend:** Node.js + TypeScript + Express + Prisma ORM
- **Banco:** PostgreSQL
- **Auth:** JWT + refresh token, bcrypt para senhas
- **RBAC:** Admin, Secretaria, Pedagogia, Tesouraria, Professor
- **Validação:** zod no frontend e backend

## Estrutura
```
/apps
  /api
  /web
```

## Rodando localmente com Docker Compose
```bash
docker compose up --build
```

## Rodando localmente com npm
```bash
npm install
npm run dev
```

### Prisma
```bash
npm run prisma:migrate
npm run prisma:seed
```

## Seeds
Usuários padrão (senha `Admin@123`):
- admin@itadam.local
- secretaria@itadam.local
- pedagogia@itadam.local
- tesouraria@itadam.local

## Variáveis de ambiente
Copie `.env.example` para `.env` e ajuste conforme necessário.

## Serviços
- API: http://localhost:4000
- Web: http://localhost:5173

## Testes
```bash
npm run test
```
