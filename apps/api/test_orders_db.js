import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log("DATABASE_URL set:", !!dbUrl);
    
    // Check if the Order table exists/how many records
    const orderCount = await prisma.order.count();
    console.log(`Orders no banco principal: ${orderCount}`);
    
    const productionOrderCount = await prisma.productionOrder.count().catch(() => 'Erro ou tabela inexistente');
    console.log(`ProductionOrder no banco principal: ${productionOrderCount}`);

    const customerCount = await prisma.customer.count().catch(() => 'Erro ou tabela inexistente');
    console.log(`Customer no banco principal: ${customerCount}`);

  } catch (error) {
    console.error("Erro ao consultar banco principal:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
