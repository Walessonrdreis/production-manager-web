import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';
import { prisma, prismaInitError } from '../../../../infra/prisma.js';

export class RefreshCatalogStockUseCase {
  static async execute() {
    // Retorna mock indicando sucesso, pois os dados estão vindo do banco.
    return { data: { success: true, message: "Dados sendo carregados diretamente do banco." } };
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
      console.warn('[GetCatalogListUseCase] Falha ao consultar OmieProduct local', err);
      return { data: { data: [], meta: { page: 1, pageSize: 0, total: 0 } } };
    }
  }
}
