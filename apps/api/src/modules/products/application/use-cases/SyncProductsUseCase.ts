import { ProductsAdapter } from '../../infrastructure/integrations/products.adapter.js';

export class SyncProductsUseCase {
  static async execute() {
    const products = await ProductsAdapter.fetchFromExternalAPI(1000);
    return { count: products.length, data: products };
  }
}
