import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Product } from '../../types/api';

export function useMyProducts() {
  const savedProducts = useLiveQuery(() => db.myProducts.toArray()) || [];

  const saveProduct = async (product: Product) => {
    await db.myProducts.put(product);
  };

  const removeProduct = async (productId: string) => {
    await db.myProducts.delete(productId);
  };

  const clearAll = async () => {
    await db.myProducts.clear();
  };

  const isSaved = (productId: string) => {
    return savedProducts.some((p) => p.id === productId);
  };

  return {
    savedProducts,
    saveProduct,
    removeProduct,
    clearAll,
    isSaved,
  };
}
