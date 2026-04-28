import { db } from '../../../lib/db';
import { Product } from '../../../types/api';

export const MyProductsRepository = {
  async getAll() {
    return db.myProducts.toArray();
  },

  async save(product: Product) {
    return db.myProducts.put(product);
  },

  async remove(productId: string) {
    return db.myProducts.delete(productId);
  },

  async clear() {
    return db.myProducts.clear();
  }
};
