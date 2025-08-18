# Backend - Multi-Tenant API (Express + Prisma + PostgreSQL)

## ⚠️ Important: OpenSSL Compatibility

If you encounter OpenSSL warnings or Prisma schema engine errors, this is a known compatibility issue. See the [Troubleshooting Guide](./TROUBLESHOOTING.md) for solutions.

## Requisitos
- Node.js 18+
- Banco PostgreSQL (Railway indicado)
- OpenSSL (for Prisma compatibility)

## Variáveis de ambiente (`.env`)
Veja `.env.example` e copie para `.env`.
- `DATABASE_URL` (obrigatório)
- `PRIMARY_DOMAIN` (opcional, ex.: `sistema.com` para resolver subdomínios)
- `PORT` (padrão 4000)

## Instalação

### Quick Start
```bash
# Use the startup script (recommended)
./start.sh

# Or manually:
npm install
npx prisma generate
npm run db:init
npm start
```

### Manual Installation
```bash
npm install
npx prisma generate
```

## Banco de dados
Empurre o schema (requer `DATABASE_URL` válido):
```bash
npx prisma db push
```

Seed de exemplo (cria produtos de exemplo):
```bash
npm run seed
```

**Observação:** ao iniciar o servidor (`npm start`), se o banco estiver vazio, o seed será executado automaticamente.

## Executar localmente

### Development Mode
```bash
npm run dev
# API em http://localhost:4000
```

### Production Mode
```bash
npm start
```

### Without Database Initialization
```bash
npm run start:no-db
```

## Testing Prisma

Test if Prisma is working correctly:
```bash
npm run test:prisma
```

## Middleware de Tenant
- Header `x-tenant-id`: busca por `tenants.id`
- Subdomínio: se `PRIMARY_DOMAIN` setado (ex.: `loja1.sistema.com` -> `name = loja1`)

## Endpoints
Base: `/api`
- `GET /products` → lista de produtos + `delivery_message`
- `POST /products` → criar produto
- `PUT /products/:id` → atualizar produto
- `DELETE /products/:id` → remover produto

Admin: `/api/admin`
- `GET /products` | `POST /products` | `PUT /products/:id` | `DELETE /products/:id`

Health Check: `/health`
- Returns application status and environment info

## Deploy (Railway)
1. Crie um Postgres no Railway e copie o `DATABASE_URL`.
2. Crie um serviço de Node.js e conecte este diretório.
3. Configure envs: `DATABASE_URL`, `PRIMARY_DOMAIN` (opcional), `PORT` (4000).
4. No Railway shell/CI: `npx prisma generate && npx prisma db push`.
   - O seed rodará automaticamente no primeiro start se não houver dados.
5. Após deploy, a API ficará em `https://<seu-servico>.railway.app/api`.

## Troubleshooting

### Common Issues
1. **OpenSSL Compatibility**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **Prisma Schema Engine Error**: Try regenerating the client
3. **Database Connection**: Check your `DATABASE_URL`

### Quick Fixes
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Regenerate client
npm install
npx prisma generate

# Test connection
npm run test:prisma
```

## Observações
- CORS liberado para `origin: true` (eco da origem).
- Graceful shutdown handling for production deployments.
- Comprehensive error handling with Prisma-specific error codes.
- Health check endpoint for monitoring.