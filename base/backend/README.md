# Backend - Multi-Tenant API (Express + Prisma + PostgreSQL)

## Requisitos
- Node.js 18+
- Banco PostgreSQL (Railway indicado)

## Variáveis de ambiente (`.env`)
Veja `.env.example` e copie para `.env`.
- `DATABASE_URL` (obrigatório)
- `PRIMARY_DOMAIN` (opcional, ex.: `sistema.com` para resolver subdomínios)
- `PORT` (padrão 4000)

## Instalação
```bash
npm install
npx prisma generate
```

## Banco de dados
Empurre o schema (requer `DATABASE_URL` válido):
```bash
npx prisma db push
```
Seed opcional de exemplo (cria tenants + produtos e templates iniciais):
```bash
npm run seed
```

## Executar localmente
```bash
npm run dev
# API em http://localhost:4000
```

## Middleware de Tenant
- Header `x-tenant-id`: busca por `tenants.id`
- Subdomínio: se `PRIMARY_DOMAIN` setado (ex.: `loja1.sistema.com` -> `name = loja1`)

## Endpoints
Base: `/api`
- `GET /tenant` → dados do tenant + `delivery_message`
- `GET /products` → lista de produtos do tenant + `delivery_message`
- `GET /templates` → lista pública de templates cadastrados
- `GET /payment/pix/:productId` → payload Pix + QR Code (data URL)

Admin: `/api/admin`
- `GET /tenants` | `POST /tenants` | `PUT /tenants/:id` | `DELETE /tenants/:id`
- `GET /tenants/:tenantId/products` | `POST /tenants/:tenantId/products` | `PUT /tenants/:tenantId/products/:id` | `DELETE /tenants/:tenantId/products/:id`
- `GET /templates` | `POST /templates` | `PUT /templates/:id` | `DELETE /templates/:id`

Observação: Produtos são sempre escopados por `tenant_id`.

Exemplo curl:
```bash
curl -H "x-tenant-id: <TENANT_ID>" http://localhost:4000/api/tenant
curl -H "x-tenant-id: <TENANT_ID>" http://localhost:4000/api/products
curl -H "x-tenant-id: <TENANT_ID>" http://localhost:4000/api/payment/pix/<PRODUCT_ID>
```

## Deploy (Railway)
1. Crie um Postgres no Railway e copie o `DATABASE_URL`.
2. Crie um serviço de Node.js e conecte este diretório.
3. Configure envs: `DATABASE_URL`, `PRIMARY_DOMAIN` (opcional), `PORT` (4000).
4. No Railway shell/CI: `npx prisma generate && npx prisma db push && npm run seed` (opcional).
5. Após deploy, a API ficará em `https://<seu-servico>.railway.app/api`.

## Observações
- CORS liberado para `origin: true` (eco da origem).
- Geo: `geoip-lite` + `request-ip` adiciona `delivery_message: "Chegará em até 14 dias"`.