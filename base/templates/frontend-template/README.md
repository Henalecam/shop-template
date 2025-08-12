# Frontend - Template Next.js (Multi-Tenant)

## Variáveis de ambiente (`.env.local`)
Veja `.env.local.example` e copie para `.env.local`.
- `NEXT_PUBLIC_BACKEND_URL` → ex.: `https://<seu-backend>.railway.app/api`
- `NEXT_PUBLIC_TENANT_ID` → `tenants.id` fixo para este front (ou deixe vazio e use subdomínio no backend)

## Rodar localmente
```bash
npm install
npm run dev
# http://localhost:3000
```

O front busca:
- `GET {BACKEND_URL}/tenant` → configura logo/cores e mostra `delivery_message`
- `GET {BACKEND_URL}/products` → lista produtos
- `GET {BACKEND_URL}/payment/pix/:productId` → abre modal com QR Code Pix

Todos os requests enviam `x-tenant-id` se `NEXT_PUBLIC_TENANT_ID` estiver definido.

## Deploy (Vercel)
1. Crie um novo projeto na Vercel apontando para `frontend-template`.
2. Configure envs: `NEXT_PUBLIC_BACKEND_URL` e `NEXT_PUBLIC_TENANT_ID`.
3. Deploy. Para criar nova loja:
   - Insira um novo registro em `tenants` no banco.
   - Faça novo projeto na Vercel copiando este template, apenas mudando `NEXT_PUBLIC_TENANT_ID` (ou use subdomínios com o mesmo front).
