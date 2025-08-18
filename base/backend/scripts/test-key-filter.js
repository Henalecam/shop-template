import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

async function testKeyFilter() {
  try {
    console.log('🧪 Testando funcionalidade de filtro por chave...\n');
    
    // Simular diferentes cenários de Products_Key
    const testScenarios = [
      { key: undefined, description: 'Sem Products_Key definida' },
      { key: 'loja_a', description: 'Products_Key = "loja_a"' },
      { key: 'loja_b', description: 'Products_Key = "loja_b"' },
      { key: '', description: 'Products_Key vazia' }
    ];
    
    for (const scenario of testScenarios) {
      console.log(`📋 Cenário: ${scenario.description}`);
      
      // Simular a variável de ambiente
      if (scenario.key !== undefined) {
        process.env.Products_Key = scenario.key;
      } else {
        delete process.env.Products_Key;
      }
      
      // Buscar produtos (simulando a lógica da API)
      const productsKey = process.env.Products_Key;
      let where = {};
      
      if (productsKey && productsKey.trim() !== '') {
        where = { key: productsKey };
      }
      
      const products = await prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          store_name: true,
          key: true
        },
        orderBy: { created_at: 'desc' }
      });
      
      console.log(`   Produtos encontrados: ${products.length}`);
      if (products.length > 0) {
        products.forEach(product => {
          console.log(`   - ${product.name} (${product.store_name}) - Chave: ${product.key || 'N/A'}`);
        });
      }
      console.log('');
    }
    
    // Mostrar todos os produtos disponíveis para referência
    console.log('📊 Todos os produtos disponíveis no banco:');
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        store_name: true,
        key: true
      },
      orderBy: { created_at: 'desc' }
    });
    
    allProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.store_name}) - Chave: ${product.key || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testKeyFilter()
    .then(() => {
      console.log('🎉 Teste concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha no teste:', error);
      process.exit(1);
    });
}

export { testKeyFilter };