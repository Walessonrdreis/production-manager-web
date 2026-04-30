import { db } from '../../../db';
import { Product } from '../../../types/api';
import { SavedProduct } from '../../../db/models';

export const MyProductsRepository = {
  async getAll(): Promise<SavedProduct[]> {
    return db.myProducts.toArray();
  },

  async save(product: Product) {
    const savedProduct: SavedProduct = {
      ...product,
      savedAt: new Date().toISOString()
    };
    return db.myProducts.put(savedProduct);
  },

  async remove(productId: string) {
    return db.myProducts.delete(productId);
  },

  async clear() {
    return db.myProducts.clear();
  }
};
