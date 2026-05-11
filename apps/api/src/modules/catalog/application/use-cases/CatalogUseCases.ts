import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';

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
    const data = await ProductsAdapter.fetchList();
    return { data };
  }
}
