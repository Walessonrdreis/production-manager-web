import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';

export class RefreshCatalogStockUseCase {
  static async execute() {
    return await ProductsAdapter.fetchStockRefresh();
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
      const response = await ProductsAdapter.fetchList();
      
      const mappedData = response.data.map((p: any) => ({
        ...p,
        stock: Number(p.stockQuantity) || 0,
        minStock: Number(p.minimumStock) || 0,
        id: p.omieCode,
        code: p.sku || p.omieCode
      }));

      return {
        data: {
          data: mappedData,
          meta: response.meta
        }
      };
    } catch (err: any) {
      console.warn('[GetCatalogListUseCase] Falha ao consultar API externa:', err);
      return { data: { data: [], meta: { page: 1, pageSize: 0, total: 0 } } };
    }
  }
}
