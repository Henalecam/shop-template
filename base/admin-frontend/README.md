# Gerenciador de Produtos

Sistema simples para gerenciar produtos de diferentes lojas, com suporte a upload de imagens via Cloudinary.

## Funcionalidades

- ✅ Criar, editar e remover produtos
- ✅ Upload de imagens via Cloudinary
- ✅ Filtro por loja
- ✅ Interface responsiva e moderna
- ✅ Validação de formulários
- ✅ Gerenciamento de estado com React Query

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js, Express, Prisma
- **Banco**: PostgreSQL
- **Upload**: Cloudinary
- **UI**: Tailwind CSS, Lucide Icons
- **Formulários**: React Hook Form + Zod

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
```

### 2. Cloudinary

1. Crie uma conta em [cloudinary.com](https://cloudinary.com)
2. Obtenha seu `cloud_name` no dashboard
3. Crie um `upload_preset` não assinado para uploads diretos

### 3. Instalação

```bash
npm install
```

### 4. Executar

```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/                 # Páginas Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── ProductForm.tsx # Formulário de produto
│   ├── ProductCard.tsx # Card de produto
│   ├── ImageUpload.tsx # Upload de imagem
│   └── StoreFilter.tsx # Filtro de loja
└── lib/                # Utilitários e API
    ├── api.ts          # Cliente da API
    └── utils.ts        # Funções utilitárias
```

## API

### Endpoints

- `GET /api/admin/products` - Listar produtos
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Atualizar produto
- `DELETE /api/admin/products/:id` - Remover produto

### Filtros

- `?store_name=nome_da_loja` - Filtrar por loja

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

## Uso

1. **Criar Produto**: Clique em "Novo Produto" e preencha o formulário
2. **Editar**: Clique em "Editar" no card do produto
3. **Remover**: Clique em "Remover" e confirme
4. **Filtrar**: Use o campo de busca para filtrar por loja
5. **Upload**: Arraste uma imagem ou clique para selecionar

## Desenvolvimento

### Comandos

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Executar build
```

### Estrutura de Dados

Cada produto possui:
- **Nome**: Identificador único (por loja)
- **Descrição**: Detalhes opcionais
- **Preço**: Valor em decimal
- **Imagem**: URL da imagem (Cloudinary)
- **Loja**: Nome da loja
- **Data**: Timestamp de criação

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request