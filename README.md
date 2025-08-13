# shop-template

## Estrutura

```
base/
  backend/                 # Projeto base (API Express + Prisma)
  templates/
    frontend-template/     # Template frontend (Next.js)
```

## Deploy no Railway (monorepo)

- Configure o projeto na raiz (`railway.json` já aponta cada serviço):
  - Serviço `backend`: `base/backend`
  - Serviço `frontend`: `base/templates/frontend-template`
- Variáveis de ambiente:
  - Backend: `DATABASE_URL` (PostgreSQL), `PRIMARY_DOMAIN` (opcional), `PORT` (4000)
  - Frontend: `PORT` (3000) e, se consumir a API, `NEXT_PUBLIC_API_URL`
  - Admin: `PORT` (3001) e `NEXT_PUBLIC_API_URL` apontando para o backend
- Build/Run:
  - Backend: usa Nixpacks, `postinstall` roda `prisma generate` e `prestart` aplica o schema (`migrate deploy` ou `db push`) e executa o seed automaticamente se o banco estiver vazio.
  - Frontend: `next build` e `next start -p $PORT` (via Procfile).
  - Admin: `next build` e `next start -p $PORT` (via Procfile).

### Passos
1) No Railway, crie um Postgres e copie o `DATABASE_URL`.
2) Crie dois serviços a partir deste repositório (o Railway detectará via `railway.json`).
3) Em cada serviço, confirme o `Root Directory` conforme acima e defina as variáveis de ambiente.
4) Deploy. O backend executa seed no primeiro start se não houver dados (tenants, templates e products).

## Desenvolvimento local

- Backend
```bash
cd base/backend
cp -n .env.example .env
# preencha DATABASE_URL
npm install
npm run dev
```

- Frontend
```bash
cd base/templates/frontend-template
npm install
npm run dev
```

- Admin (opcional)
```bash
cd base/admin-frontend
npm install
# Se não configurar o backend, o admin usa fallbacks com dados de exemplo
npm run dev
```
