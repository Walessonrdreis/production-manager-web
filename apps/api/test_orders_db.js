import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

const legacyPrisma = new PrismaClient({
  datasourceUrl: process.env.LEGACY_DATABASE_URL
});

async function main() {
  try {
    const raw1 = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("=== BANCO 1 (Principal API 2) ===");
    console.log(raw1.map(r => r.table_name));

    const raw2 = await legacyPrisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("\n=== BANCO 2 (Legacy API 1) ===");
    console.log(raw2.map(r => r.table_name));

  } catch (error) {
    console.error("Erro:", error.message);
  } finally {
    await prisma.$disconnect();
    await legacyPrisma.$disconnect();
  }
}

main();
