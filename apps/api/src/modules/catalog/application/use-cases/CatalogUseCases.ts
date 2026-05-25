import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';
import { prisma } from '../../../../infra/prisma.js';

export class RefreshCatalogStockUseCase {
  static async execute() {
    const data = await ProductsAdapter.fetchStockRefresh();
    return { data };
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
      const dbProducts = await prisma.$queryRaw<any[]>`SELECT * FROM "OmieProduct"`;
      console.log('Fetched products directly', dbProducts.length);
      const data = dbProducts.map((p) => {
        return p.rawPayload;
      });
      return { 
        data: {
          data,
          meta: {
            page: 1,
            pageSize: data.length,
            total: data.length
          }
        } 
      };
    } catch (err: any) {
      console.warn('[GetCatalogListUseCase] Falha ao consultar OmieProduct local, fazendo fallback', err);
      const data = await ProductsAdapter.fetchList();
      return { data };
    }
  }
}
