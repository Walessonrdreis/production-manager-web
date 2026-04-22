import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../../types/api';

interface MyProductsStore {
  savedProducts: Product[];
  saveProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  isSaved: (productId: string) => boolean;
}

export const useMyProductsStore = create<MyProductsStore>()(
  persist(
    (set, get) => ({
      savedProducts: [],
      saveProduct: (product) => {
        const { savedProducts } = get();
        if (!savedProducts.find((p) => p.id === product.id)) {
          set({ savedProducts: [...savedProducts, product] });
        }
      },
      removeProduct: (productId) => {
        set({
          savedProducts: get().savedProducts.filter((p) => p.id !== productId),
        });
      },
      clearAll: () => set({ savedProducts: [] }),
      isSaved: (productId) => {
        return get().savedProducts.some((p) => p.id === productId);
      },
    }),
    {
      name: 'prod-manager-my-products',
    }
  )
);

export function useMyProducts() {
  const store = useMyProductsStore();
  return {
    savedProducts: store.savedProducts,
    saveProduct: store.saveProduct,
    removeProduct: store.removeProduct,
    clearAll: store.clearAll,
    isSaved: store.isSaved,
  };
}
