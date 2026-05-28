import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';
import { prisma } from '../../../../infra/prisma.js';

export class RefreshCatalogStockUseCase {
  static async execute() {
    // Busca a fotografia mais recente dos estoques diretamente no banco
    // A API 1 já popula/atualiza essa tabela product_stock em background
    const stocks = await prisma.productStock.findMany({
      select: {
        omieCode: true,
        stockQuantity: true,
        minimumStock: true
      }
    });
    
    const mappedStocks = stocks.map(s => ({
       code: s.omieCode,
       stock: Number(s.stockQuantity),
       minStock: Number(s.minimumStock)
    }));

    return { data: mappedStocks };
  }
}

export class GetAdminCatalogUseCase {
  static async execute() {
    const data = await ProductsAdapter.fetchAdminProducts();
    return { data };
  }
}

export class GetCatalogListUseCase {
  static async execute() {
    try {
      // Step 2: Implement query in our shared database via Prisma
      // Fetching OmieProducts with their respective ProductStock relation
      const dbProducts = await prisma.omieProduct.findMany({
        where: { active: true },
        include: { productStock: true }
      });
      
      // Step 2: Normalize/map data (Adapter) to follow the strict contract expected by the UI.
      const mappedData = dbProducts.map((p) => {
        // Parse raw payload to restore all original Omie product properties if available
        let raw = {};
        try {
          raw = typeof p.rawPayload === 'string' ? JSON.parse(p.rawPayload) : (p.rawPayload || {});
        } catch (e) {
            // Ignore
        }

        const stockQuantity = p.productStock?.stockQuantity ? Number(p.productStock.stockQuantity) : 0;
        const minimumStock = p.productStock?.minimumStock ? Number(p.productStock.minimumStock) : 0;

        return {
          ...raw,
          // Overrides below guarantee minimum stability for UI model identifiers
          id: p.omieCode,
          code: p.sku || p.omieCode,
          sku: p.sku,
          omieCode: p.omieCode,
          description: p.description,
          active: p.active,
          stock: stockQuantity,
          minStock: minimumStock,
          stockQuantity: stockQuantity,
          minimumStock: minimumStock
        };
      });

      return {
        data: {
          data: mappedData,
          meta: {
            page: 1,
            pageSize: mappedData.length,
            total: mappedData.length
          }
        }
      };
    } catch (err: any) {
      console.warn('[GetCatalogListUseCase] Falha ao consultar banco de dados compartilhado:', err);
      return { data: { data: [], meta: { page: 1, pageSize: 0, total: 0 } } };
    }
  }
}
