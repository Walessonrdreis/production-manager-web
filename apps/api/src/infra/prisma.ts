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
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres') || !prismaClient) {
      // Mock objects for models so app doesn't crash in preview environment without DB
      return new Proxy({}, {
        get(t, p) {
          return async () => {
            console.warn(`[Prisma Mock] DATABASE_URL invalid or missing. Mocking ${String(prop)}.${String(p)}`);
            if (p === 'findMany') return [];
            if (p === 'findUnique' || p === 'findFirst') return null;
            if (p === 'count') return 0;
            return {};
          };
        }
      });
    }
    return prismaClient[prop];
  }
});
