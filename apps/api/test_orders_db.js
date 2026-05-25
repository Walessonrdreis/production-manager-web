import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const raw = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in public schema:");
    console.log(raw.map(r => r.table_name));

    // And specific counts:
    try {
      const c1 = await prisma.$queryRaw`SELECT count(*) FROM "Customer"`;
      console.log("Customer count:", c1[0].count);
    } catch(e) {}
    try {
      const c2 = await prisma.$queryRaw`SELECT count(*) FROM "clientes"`;
      console.log("clientes count:", c2[0].count);
    } catch(e) {}

  } catch (error) {
    console.error("Erro:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
