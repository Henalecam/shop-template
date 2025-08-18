import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAddKey() {
  try {
    console.log('🔄 Iniciando migração para adicionar campo key...');
    
    // Executar a migração SQL diretamente
    await prisma.$executeRaw`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS "key" TEXT;
    `;
    
    console.log('✅ Campo key adicionado com sucesso!');
    
    // Verificar se a migração foi aplicada
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'key';
    `;
    
    console.log('📊 Verificação da migração:', result);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a migração se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAddKey()
    .then(() => {
      console.log('🎉 Migração concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha na migração:', error);
      process.exit(1);
    });
}

export { migrateAddKey };