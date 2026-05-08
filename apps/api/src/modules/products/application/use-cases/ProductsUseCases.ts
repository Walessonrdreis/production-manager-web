import { ProductsAdapter } from '../../infrastructure/integrations/products.adapter.js';

export class RefreshStockUseCase {
  static async execute() {
    const data = await ProductsAdapter.fetchStockRefresh();
    return { data };
  }
}

export class GetAdminProductsUseCase {
  static async execute() {
    const data = await ProductsAdapter.fetchAdminProducts();
    return { data };
  }
}

export class GetProductsListUseCase {
  static async execute() {
    const data = await ProductsAdapter.fetchList();
    return { data };
  }
}
