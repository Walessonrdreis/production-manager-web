import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.customer.count();
  console.log("Customers in DB:", count);
  const first = await prisma.customer.findFirst();
  if (first) {
    console.log("First:", first.data.slice(0, 100));
  }
}
main().finally(() => prisma.$disconnect());
