-- Inicialização do banco de dados multi-tenant
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar se a tabela já existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Product') THEN
        -- Criar tabela Product
        CREATE TABLE "Product" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "price" DECIMAL(10,2) NOT NULL,
            "image_url" TEXT,
            "store_name" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
        );

        -- Criar índice único para nome e loja
        CREATE UNIQUE INDEX "name_store_name" ON "Product"("name", "store_name");
        
        -- Criar índice para busca por loja
        CREATE INDEX "store_name_idx" ON "Product"("store_name");
        
        -- Criar índice para ordenação por data
        CREATE INDEX "created_at_idx" ON "Product"("created_at");
    END IF;
END $$;

-- Inserir dados de exemplo
INSERT INTO "Product" ("id", "name", "description", "price", "image_url", "store_name", "created_at") VALUES
    (uuid_generate_v4(), 'Smartphone Galaxy S23', 'Smartphone Samsung Galaxy S23 com 128GB, 8GB RAM', 2999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'Loja Tech', NOW()),
    (uuid_generate_v4(), 'Notebook Dell Inspiron', 'Notebook Dell Inspiron 15" com Intel i5, 8GB RAM, 256GB SSD', 3499.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'Loja Tech', NOW()),
    (uuid_generate_v4(), 'Fone de Ouvido Bluetooth', 'Fone de ouvido sem fio com cancelamento de ruído', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Loja Tech', NOW()),
    (uuid_generate_v4(), 'Camiseta Básica', 'Camiseta 100% algodão, disponível em várias cores', 49.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'Loja Fashion', NOW()),
    (uuid_generate_v4(), 'Tênis Esportivo', 'Tênis para corrida com amortecimento avançado', 199.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Loja Fashion', NOW()),
    (uuid_generate_v4(), 'Mesa de Escritório', 'Mesa de escritório em madeira maciça, 120x60cm', 599.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'Loja Casa', NOW()),
    (uuid_generate_v4(), 'Sofá 3 Lugares', 'Sofá confortável em tecido, 3 lugares', 1299.99, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'Loja Casa', NOW()),
    (uuid_generate_v4(), 'Livro de Programação', 'Livro sobre desenvolvimento web com React e Node.js', 89.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'Loja Livros', NOW())
ON CONFLICT ("name", "store_name") DO NOTHING;