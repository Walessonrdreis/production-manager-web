import { ProductsAdapter } from '../../infrastructure/integrations/products.adapter.js';

export class SyncProductsUseCase {
  static async execute(limit: number = 1000) {
    const products = await ProductsAdapter.fetchFromExternalAPI(limit);
    return { count: products.length, data: products };
  }
}
