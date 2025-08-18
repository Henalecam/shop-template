# 🔑 Filtro de Produtos por Chave (Products_Key)

Esta funcionalidade permite filtrar produtos baseado em uma variável de ambiente `Products_Key`, mostrando apenas os produtos que possuem a chave especificada.

## ✨ Como Funciona

1. **Sem variável definida**: Retorna todos os produtos (comportamento padrão)
2. **Com variável definida**: Retorna apenas produtos com a chave correspondente
3. **Chave vazia**: Retorna todos os produtos (tratado como não definida)

## 🚀 Configuração

### 1. Variável de Ambiente

Adicione ao seu arquivo `.env`:

```bash
# Para filtrar por uma chave específica
Products_Key="minha_chave_secreta"

# Para não filtrar (retornar todos os produtos)
Products_Key=""
```

### 2. Banco de Dados

O campo `key` foi adicionado à tabela `products`. Execute a migração:

```bash
# Opção 1: Usar o script de migração
node scripts/migrate-add-key.js

# Opção 2: Usar Prisma CLI
npx prisma db push
```

## 📝 Uso da API

### Endpoints Afetados

- `GET /api/products` - Lista produtos filtrados por chave
- `GET /api/admin/products` - Lista produtos filtrados por chave (admin)
- `POST /api/products` - Cria produto com chave opcional
- `POST /api/admin/products` - Cria produto com chave opcional (admin)
- `PUT /api/products/:id` - Atualiza produto incluindo chave
- `PUT /api/admin/products/:id` - Atualiza produto incluindo chave (admin)

### Exemplo de Criação de Produto

```json
POST /api/products
{
  "name": "Produto Teste",
  "description": "Descrição do produto",
  "price": 29.99,
  "store_name": "Minha Loja",
  "key": "chave_loja_a"
}
```

### Exemplo de Resposta Filtrada

Quando `Products_Key="chave_loja_a"`:

```json
{
  "products": [
    {
      "id": "uuid-1",
      "name": "Produto Teste",
      "description": "Descrição do produto",
      "price": "29.99",
      "image_url": null,
      "store_name": "Minha Loja",
      "key": "chave_loja_a",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🧪 Testando

Execute o script de teste para ver a funcionalidade em ação:

```bash
node scripts/test-key-filter.js
```

## 🔒 Casos de Uso

### 1. Multi-tenancy
- Cada loja tem sua própria chave
- Produtos são isolados por loja

### 2. Ambiente de Desenvolvimento
- Filtrar produtos de teste
- Separar dados de diferentes desenvolvedores

### 3. Segurança
- Restringir acesso a produtos específicos
- Controle de visibilidade baseado em chave

## ⚠️ Considerações

1. **Performance**: O filtro é aplicado no nível do banco de dados
2. **Segurança**: A chave é lida do servidor, não do cliente
3. **Flexibilidade**: Produtos sem chave são sempre visíveis
4. **Compatibilidade**: Produtos existentes continuam funcionando

## 🐛 Troubleshooting

### Problema: Produtos não aparecem
- Verifique se a variável `Products_Key` está definida corretamente
- Confirme se os produtos têm a chave correspondente

### Problema: Erro de migração
- Verifique se o banco está acessível
- Confirme se o usuário tem permissões ALTER TABLE

### Problema: API retorna erro 500
- Verifique os logs do servidor
- Confirme se o campo `key` foi adicionado à tabela