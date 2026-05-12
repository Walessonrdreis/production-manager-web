import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ApiMyProductsRepository } from '../../features/stocks/infra/ApiMyProductsRepository';
import { 
  selectProduct as selectProductUseCase, 
  unselectProduct as unselectProductUseCase,
  getSelectedProducts,
  clearMyProducts,
  updateProductSector,
  updateProduct as updateProductUseCase
} from '../../features/stocks';
import { Product } from '../../types/api';
import { useToast } from '../../components/ui/Toast';

export function useStocks() {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['myProducts'],
    queryFn: () => ApiMyProductsRepository.getAll()
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['myProducts'] });
  }, [queryClient]);

  const savedProducts = products;

  const saveProduct = async (product: Product) => {
    const res = await selectProductUseCase(product);
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Produto salvo nos favoritos.');
      invalidate();
    }
    return res;
  };

  const assignSector = async (productId: string, sectorId: string | undefined) => {
    const res = await updateProductSector(productId, sectorId);
    if (!res.success) {
      toastError(res.error);
    } else {
      invalidate();
    }
    return res;
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    await queryClient.cancelQueries({ queryKey: ['myProducts'] });
    
    // Optimistic update
    queryClient.setQueryData(['myProducts'], (old: any) => {
      if (!old) return [];
      return old.map((p: any) => p.id === productId ? { ...p, ...data } : p);
    });

    const res = await updateProductUseCase(productId, data);
    if (!res.success) {
      toastError(res.error);
      invalidate(); // Revert on error
    } else {
      invalidate(); // Refetch to ensure sync
    }
    return res;
  };

  const updateBulkMinStock = async (productIds: string[], minStock: number) => {
    const promises = productIds.map(id => updateProductUseCase(id, { minStock }));
    const results = await Promise.all(promises);
    const hasError = results.some(r => !r.success);
    
    if (hasError) {
      toastError('Erro ao atualizar alguns produtos.');
    } else {
      success('Estoque mínimo atualizado com sucesso.');
    }
    
    invalidate();
  };

  const updateBulkCategory = async (productIds: string[], category: string) => {
    const promises = productIds.map(id => updateProductUseCase(id, { category: category === '' ? undefined : category }));
    const results = await Promise.all(promises);
    const hasError = results.some(r => !r.success);
    
    if (hasError) {
      toastError('Erro ao atualizar alguns produtos.');
    } else {
      success('Categoria atualizada com sucesso.');
    }
    
    invalidate();
  };

  const updateBulkSectors = async (productIds: string[], sectorIds: string[]) => {
    const promises = productIds.map(id => updateProductUseCase(id, { sectorIds }));
    const results = await Promise.all(promises);
    const hasError = results.some(r => !r.success);
    
    if (hasError) {
      toastError('Erro ao atualizar alguns produtos.');
    } else {
      success('Setores atualizados com sucesso.');
    }
    
    invalidate();
  };

  const removeProduct = async (productId: string) => {
    const res = await unselectProductUseCase(productId);
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Produto removido dos favoritos.');
      invalidate();
    }
    return res;
  };

  const clearAll = async () => {
    const res = await clearMyProducts();
    if (!res.success) {
      toastError(res.error);
    } else {
      success('Lista de favoritos limpa.');
      invalidate();
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
    updateBulkMinStock,
    updateBulkCategory,
    updateBulkSectors,
    removeProduct,
    clearAll,
    isSaved,
    isLoading,
    error: null,
  };
}
