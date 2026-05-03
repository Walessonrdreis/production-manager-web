import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { 
  selectProduct as selectProductUseCase, 
  unselectProduct as unselectProductUseCase,
  getSelectedProducts,
  clearMyProducts,
  updateProductSector,
  updateProduct as updateProductUseCase
} from '../../features/products';
import { Product } from '../../types/api';
import { useToast } from '../../components/ui/Toast';

export function useMyProducts() {
  const { success, error: toastError } = useToast();
  const products = useLiveQuery(() => db.myProducts.toArray());
  const savedProducts = products || [];

  const saveProduct = async (product: Product) => {
    const res = await selectProductUseCase(product);
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Produto salvo nos favoritos.');
    }
    return res;
  };

  const assignSector = async (productId: string, sectorId: string | undefined) => {
    const res = await updateProductSector(productId, sectorId);
    if (!res.success) {
      toastError(res.error);
    }
    return res;
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    const res = await updateProductUseCase(productId, data);
    if (!res.success) {
      toastError(res.error);
    }
    return res;
  };

  const removeProduct = async (productId: string) => {
    const res = await unselectProductUseCase(productId);
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Produto removido dos favoritos.');
    }
    return res;
  };

  const clearAll = async () => {
    const res = await clearMyProducts();
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Lista de favoritos limpa.');
    }
    return res;
  };

  const isSaved = (productId: string) => {
    return savedProducts.some((p) => p.id === productId);
  };

  return {
    savedProducts,
    saveProduct,
    assignSector,
    updateProduct,
    removeProduct,
    clearAll,
    isSaved,
    isLoading: products === undefined,
    error: null,
  };
}
