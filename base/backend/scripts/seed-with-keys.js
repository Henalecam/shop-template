import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

async function seedWithKeys() {
  try {
    console.log('🌱 Populando banco com produtos de exemplo...\n');
    
    // Limpar produtos existentes (opcional)
    console.log('🧹 Limpando produtos existentes...');
    await prisma.product.deleteMany({});
    
    // Produtos de exemplo com diferentes chaves
    const sampleProducts = [
      {
        name: "Smartphone Galaxy S21",
        description: "Smartphone Samsung com câmera de 64MP",
        price: 1299.99,
        image_url: "https://example.com/galaxy-s21.jpg",
        store_name: "Loja A",
        key: "loja_a"
      },
      {
        name: "iPhone 13 Pro",
        description: "iPhone Apple com chip A15 Bionic",
        price: 1599.99,
        image_url: "https://example.com/iphone-13-pro.jpg",
        store_name: "Loja A",
        key: "loja_a"
      },
      {
        name: "Notebook Dell Inspiron",
        description: "Notebook com Intel i7 e 16GB RAM",
        price: 899.99,
        image_url: "https://example.com/dell-inspiron.jpg",
        store_name: "Loja B",
        key: "loja_b"
      },
      {
        name: "MacBook Air M1",
        description: "MacBook com chip Apple M1",
        price: 1899.99,
        image_url: "https://example.com/macbook-air.jpg",
        store_name: "Loja B",
        key: "loja_b"
      },
      {
        name: "Fone de Ouvido Sony WH-1000XM4",
        description: "Fone com cancelamento de ruído",
        price: 299.99,
        image_url: "https://example.com/sony-wh1000xm4.jpg",
        store_name: "Loja C",
        key: "loja_c"
      },
      {
        name: "Smart TV LG 55\"",
        description: "TV 4K com WebOS",
        price: 599.99,
        image_url: "https://example.com/lg-tv-55.jpg",
        store_name: "Loja C",
        key: "loja_c"
      },
      {
        name: "Produto Sem Chave",
        description: "Este produto não tem chave definida",
        price: 99.99,
        image_url: "https://example.com/no-key.jpg",
        store_name: "Loja Geral"
        // Sem campo key
      }
    ];
    
    console.log('📦 Criando produtos de exemplo...');
    
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData
      });
      
      console.log(`   ✅ ${product.name} - ${product.store_name} - Chave: ${product.key || 'N/A'}`);
    }
    
    console.log('\n🎉 Banco populado com sucesso!');
    console.log('\n📊 Resumo dos produtos criados:');
    
    // Mostrar estatísticas
    const totalProducts = await prisma.product.count();
    const productsWithKey = await prisma.product.count({
      where: { key: { not: null } }
    });
    const productsWithoutKey = await prisma.product.count({
      where: { key: null }
    });
    
    console.log(`   Total de produtos: ${totalProducts}`);
    console.log(`   Produtos com chave: ${productsWithKey}`);
    console.log(`   Produtos sem chave: ${productsWithoutKey}`);
    
    // Mostrar produtos por chave
    const productsByKey = await prisma.product.groupBy({
      by: ['key'],
      _count: { id: true }
    });
    
    console.log('\n🔑 Produtos por chave:');
    productsByKey.forEach(group => {
      const keyLabel = group.key || 'Sem chave';
      console.log(`   ${keyLabel}: ${group._count.id} produtos`);
    });
    
    console.log('\n💡 Para testar o filtro por chave:');
    console.log('   1. Configure Products_Key no .env');
    console.log('   2. Execute: npm run test:key-filter');
    console.log('   3. Ou faça requisições para a API');
    
  } catch (error) {
    console.error('❌ Erro durante a população do banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWithKeys()
    .then(() => {
      console.log('\n🎯 Script concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Falha na execução:', error);
      process.exit(1);
    });
}

export { seedWithKeys };