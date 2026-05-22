import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;
let legacyPrismaClient: PrismaClient | null = null;

try {
  // We only instantiate Prisma if it's implicitly needed, or if URL is somewhat valid.
  // Prisma will fail query if URL is bad, but initialization crash is ugly. 
  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
} catch (e) {
  console.warn('[Prisma] failed to initialize primary client, skipping...');
}

try {
  legacyPrismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.LEGACY_DATABASE_URL
      }
    }
  });
} catch (e) {
  console.warn('[Prisma] failed to initialize legacy client, skipping...');
}

// Export a proxy so we can intercept calls if the client failed to initialize or URL is completely missing/invalid
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop: keyof PrismaClient) {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres') || !prismaClient) {
      // Mock objects for models so app doesn't crash in preview environment without DB
      return new Proxy({}, {
        get(t, p) {
          return async () => {
            console.warn(`[Prisma Mock - Primary] DATABASE_URL invalid or missing. Mocking ${String(prop)}.${String(p)}`);
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

export const legacyPrisma = new Proxy({} as PrismaClient, {
  get(target, prop: keyof PrismaClient) {
    if (!process.env.LEGACY_DATABASE_URL || !process.env.LEGACY_DATABASE_URL.startsWith('postgres') || !legacyPrismaClient) {
      // Mock objects for models so app doesn't crash in preview environment without DB
      return new Proxy({}, {
        get(t, p) {
          return async () => {
            console.warn(`[Prisma Mock - Legacy] LEGACY_DATABASE_URL invalid or missing. Mocking ${String(prop)}.${String(p)}`);
            if (p === 'findMany') return [];
            if (p === 'findUnique' || p === 'findFirst') return null;
            if (p === 'count') return 0;
            return {};
          };
        }
      });
    }
    return legacyPrismaClient[prop];
  }
});

/**
 * PHASE 1 MIGRATION: Database connection validation (Dual Database setup)
 */
export async function validateConnections() {
  console.log('[Migration Phase 1] Validating database connections...');
  
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
    console.warn('[Migration Phase 1] Skipping primary connection validation (DATABASE_URL invalid or missing)');
  } else {
    try {
      if (prismaClient) {
        await prismaClient.$queryRaw`SELECT 1 as test`;
        console.log('[Migration Phase 1] ✅ Connection to PRIMARY DATABASE validated successfully.');
      }
    } catch (e) {
      console.error('[Migration Phase 1] ❌ Error connecting to PRIMARY DATABASE:', e);
    }
  }

  if (!process.env.LEGACY_DATABASE_URL || !process.env.LEGACY_DATABASE_URL.startsWith('postgres')) {
    console.warn('[Migration Phase 1] Skipping legacy connection validation (LEGACY_DATABASE_URL invalid or missing)');
  } else {
    try {
      if (legacyPrismaClient) {
        await legacyPrismaClient.$queryRaw`SELECT 1 as test`;
        console.log('[Migration Phase 1] ✅ Connection to LEGACY DATABASE validated successfully.');
      }
    } catch (e) {
      console.error('[Migration Phase 1] ❌ Error connecting to LEGACY DATABASE:', e);
    }
  }
}

