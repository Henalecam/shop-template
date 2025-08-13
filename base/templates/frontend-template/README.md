# Frontend - Template Next.js (Multi-Tenant)

## Variáveis de ambiente (`.env.local`)
Veja `.env.local.example` e copie para `.env.local`.
- `NEXT_PUBLIC_BACKEND_URL` (opcional) → ex.: `https://<seu-backend>.railway.app/api`. Se não definir, o front usa fallback `"/api"`.
- `NEXT_PUBLIC_TENANT_ID` (opcional) → `tenants.id` fixo para este front (ou deixe vazio e use `?tenantId=` ou subdomínio no backend)

Dica: Também é possível abrir o front em modo preview adicionando `?tenantId=<id>` na URL. Isso define o cabeçalho `x-tenant-id` no client.

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
- `GET {BACKEND_URL}/templates` → lista templates com links de preview

Todos os requests enviam `x-tenant-id` se `NEXT_PUBLIC_TENANT_ID` estiver definido ou se `?tenantId=` estiver presente na URL.

## Deploy (Vercel)
1. Crie um novo projeto na Vercel apontando para `frontend-template`.
2. Configure envs: `NEXT_PUBLIC_BACKEND_URL` e `NEXT_PUBLIC_TENANT_ID` (opcionais; se não definir, certifique-se de que o backend e o front estejam sob o mesmo domínio/reverso com `/api`).
3. Deploy. Para criar nova loja:
   - Insira um novo registro em `tenants` no banco.
   - Faça novo projeto na Vercel copiando este template, apenas mudando `NEXT_PUBLIC_TENANT_ID` (ou use subdomínios com o mesmo front).
