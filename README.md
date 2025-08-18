# Sistema de Gestão de Produtos Multi-Tenant

Sistema completo para gestão de produtos com suporte a múltiplas lojas (multi-tenant), incluindo frontend em Next.js e backend em Node.js com Prisma.

## 🚀 Funcionalidades

- ✅ **Gestão Completa de Produtos**: Criar, editar, visualizar e remover produtos
- ✅ **Multi-Tenant**: Suporte a múltiplas lojas com filtros
- ✅ **Upload de Imagens**: Suporte a imagens de produtos
- ✅ **Validações**: Validação robusta de dados no frontend e backend
- ✅ **Interface Moderna**: UI responsiva com Tailwind CSS
- ✅ **API RESTful**: Backend robusto com Express.js
- ✅ **Banco de Dados**: PostgreSQL com Prisma ORM
- ✅ **Tratamento de Erros**: Sistema completo de notificações e tratamento de erros

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de estado do servidor
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **CORS** - Middleware para CORS

## 📋 Pré-requisitos

- Node.js 18.18.0 ou superior
- PostgreSQL 12 ou superior
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd multi-tenant-products
```

### 2. Configure o Backend

```bash
cd base/backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco

# Configure o banco de dados
npm run prisma:generate
npm run prisma:push

# Execute as migrações (se houver)
npm run prisma:migrate

# Popule o banco com dados de exemplo (opcional)
npm run seed

# Inicie o servidor
npm run dev
```

### 3. Configure o Frontend

```bash
cd base/admin-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite o arquivo .env.local com a URL da API

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Configuração das Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/multi_tenant_db"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NODE_ENV=development
```

## 🗄️ Estrutura do Banco de Dados

### Tabela Product
```sql
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

## 📱 Como Usar

### 1. Acesse o Sistema
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### 2. Gestão de Produtos
- **Criar Produto**: Clique em "Novo Produto" e preencha o formulário
- **Editar Produto**: Clique no botão "Editar" em qualquer produto
- **Remover Produto**: Clique no botão "Remover" e confirme
- **Filtrar por Loja**: Use o filtro de loja para ver produtos específicos

### 3. Campos Obrigatórios
- **Nome**: Nome do produto
- **Preço**: Preço em formato decimal (ex: 29.99)
- **Nome da Loja**: Nome da loja onde o produto está disponível

### 4. Campos Opcionais
- **Descrição**: Descrição detalhada do produto
- **Imagem**: URL da imagem do produto

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm start            # Produção
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:push      # Sincronizar schema com banco
npm run prisma:migrate   # Executar migrações
npm run seed             # Popular banco com dados de exemplo
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm start            # Iniciar produção
npm run lint         # Verificar código
```

## 🐛 Solução de Problemas

### Erro: "s.price.toFixed is not a function"
- **Causa**: Campo price sendo retornado como string ou Decimal do Prisma
- **Solução**: Já corrigido com validação de tipos no frontend e conversão no backend

### Erro: "Failed to load resource: 404"
- **Causa**: Favicon não encontrado ou API não respondendo
- **Solução**: Verificar se o backend está rodando na porta 4000

### Erro de Conexão com Banco
- **Causa**: DATABASE_URL incorreta ou PostgreSQL não rodando
- **Solução**: Verificar configuração do banco e se o serviço está ativo

## 📁 Estrutura do Projeto

```
multi-tenant-products/
├── base/
│   ├── admin-frontend/          # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/            # Páginas da aplicação
│   │   │   ├── components/     # Componentes React
│   │   │   └── lib/            # Utilitários e API
│   │   └── package.json
│   └── backend/                 # Backend Node.js
│       ├── src/
│       │   ├── routes/         # Rotas da API
│       │   └── index.js        # Servidor principal
│       ├── prisma/             # Schema e migrações
│       └── package.json
└── README.md
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para gestão eficiente de produtos multi-tenant**
