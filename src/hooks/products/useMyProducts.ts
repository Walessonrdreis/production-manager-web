import { useLiveQuery } from 'dexie-react-hooks';
import { 
  selectProduct as selectProductUseCase, 
  unselectProduct as unselectProductUseCase,
  getSelectedProducts,
  clearMyProducts
} from '../../features/products';
import { Product } from '../../types/api';

export function useMyProducts() {
  const savedProducts = useLiveQuery(() => getSelectedProducts()) || [];

  const saveProduct = async (product: Product) => {
    await selectProductUseCase(product);
  };

  const removeProduct = async (productId: string) => {
    await unselectProductUseCase(productId);
  };

  const clearAll = async () => {
    await clearMyProducts();
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
