import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Product'`;
    console.log('Product table columns:');
    console.log(JSON.stringify(result, null, 2));

    const data = await prisma.$queryRaw`SELECT * FROM "Product" LIMIT 5`;
    console.log('Sample data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching columns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
