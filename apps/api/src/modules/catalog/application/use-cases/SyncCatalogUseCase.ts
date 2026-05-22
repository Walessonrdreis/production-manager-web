import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';
import { legacyPrisma } from '../../../../infra/prisma.js';

export class SyncCatalogUseCase {
  static async execute(limit: number = 1000) {
    const products = await ProductsAdapter.fetchFromExternalAPI(limit);
    
    // Save to Prisma
    try {
      const validProductIds = new Set<string>();

      // Upsert fetched products
      for (const product of products) {
        const productId = product.codigo || product.codigo_produto;
        if (!productId) continue;
        validProductIds.add(String(productId));
        
        await legacyPrisma.catalog.upsert({
          where: { id: String(productId) },
          create: { id: String(productId), data: JSON.stringify(product) },
          update: { data: JSON.stringify(product) }
        });
      }
      console.log(`[SYNC CATALOG] Successfully saved ${products.length} catalog items to Prisma.`);

      // Delete obsolete products
      if (validProductIds.size > 0) {
        const allCatalog = await legacyPrisma.catalog.findMany({ select: { id: true } });
        const docsToDelete = allCatalog.filter(p => !validProductIds.has(p.id)).map(p => p.id);

        if (docsToDelete.length > 0) {
          await legacyPrisma.catalog.deleteMany({
            where: { id: { in: docsToDelete } }
          });
          console.log(`[SYNC CATALOG] Successfully deleted ${docsToDelete.length} obsolete items from Prisma.`);
        }
      }
    } catch (err: any) {
      console.error('[SYNC CATALOG] Error saving to Prisma:', err.message);
    }

    return { count: products.length, data: products };
  }
}

