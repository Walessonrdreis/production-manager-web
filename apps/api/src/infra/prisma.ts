import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

try {
  // We only instantiate Prisma if it's implicitly needed, or if URL is somewhat valid.
  // Prisma will fail query if URL is bad, but initialization crash is ugly. 
  prismaClient = new PrismaClient();
} catch (e) {
  console.warn('[Prisma] failed to initialize, skipping...');
}

// Export a proxy so we can intercept calls if the client failed to initialize or URL is completely missing/invalid
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop: keyof PrismaClient) {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
      return () => {
        throw new Error('DATABASE_URL is missing or invalid. Please configure it in your environment (e.g. Render Dashboard).');
      };
    }
    if (prismaClient) {
      return prismaClient[prop];
    }
    return () => { throw new Error('Prisma database client is not initialized.'); };
  }
});
