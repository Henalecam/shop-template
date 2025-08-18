#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

console.log('🧪 Testing Prisma Client...');

try {
  console.log('1. Creating Prisma client...');
  const prisma = new PrismaClient();
  
  console.log('2. Testing connection...');
  await prisma.$connect();
  console.log('✅ Database connection successful');
  
  console.log('3. Testing basic query...');
  const productCount = await prisma.product.count();
  console.log(`✅ Product count: ${productCount}`);
  
  console.log('4. Disconnecting...');
  await prisma.$disconnect();
  console.log('✅ Disconnected successfully');
  
  console.log('🎉 All tests passed! Prisma is working correctly.');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  process.exit(1);
}