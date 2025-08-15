# Sistema de Gerenciamento de Produtos

Sistema simples para gerenciar produtos de diferentes lojas, com backend em Node.js/Express e frontend em Next.js.

## Estrutura do Projeto

```
shop-template/
├── base/
│   ├── backend/           # API Node.js + Express + Prisma
│   └── admin-frontend/    # Interface de gestão (Next.js)
└── .gitignore
```

## Componentes

### Backend (`base/backend/`)
- **API REST** para CRUD de produtos
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **Endpoints**:
  - `GET /api/admin/products` - Listar produtos
  - `POST /api/admin/products` - Criar produto
  - `PUT /api/admin/products/:id` - Atualizar produto
  - `DELETE /api/admin/products/:id` - Remover produto

### Frontend (`base/admin-frontend/`)
- **Interface de gestão** para produtos
- **Upload de imagens** via Cloudinary
- **Filtro por loja**
- **Validação de formulários** com React Hook Form + Zod
- **Gerenciamento de estado** com React Query

## Configuração

### Backend
```bash
cd base/backend
npm install
npm run dev
```

### Frontend
```bash
cd base/admin-frontend
npm install
npm run dev
```

## Banco de Dados

### Schema
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  image_url   String?
  store_name  String
  created_at  DateTime @default(now())

  @@unique([name, store_name], name: "name_store_name")
}
```

## Variáveis de Ambiente

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
```

## Funcionalidades

- ✅ Criar, editar e remover produtos
- ✅ Upload de imagens via Cloudinary
- ✅ Filtro por loja
- ✅ Interface responsiva e moderna
- ✅ Validação de formulários
- ✅ Gerenciamento de estado com React Query

## Tecnologias

- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Upload**: Cloudinary
- **Formulários**: React Hook Form + Zod
- **Estado**: React Query
