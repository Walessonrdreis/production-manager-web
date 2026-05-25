import { PrismaClient } from '@prisma/client';
console.log('LEGACY_DATABASE_URL:', process.env.LEGACY_DATABASE_URL ? 'set' : 'not set');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.LEGACY_DATABASE_URL } }
});
async function main() {
  try {
    const count = await prisma.customer.count();
    console.log("Legacy DB Customers count:", count);
    const first = await prisma.customer.findFirst();
    if(first) console.log("First:", first.data.slice(0, 100));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
main().finally(() => prisma.$disconnect());
