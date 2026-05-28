import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncCatalogWithOmie, syncStockWithOmie } from '../../features/catalog/usecases/SyncCatalogWithOmie';
import { useToast } from '../../components/ui/Toast';

export function useSyncCatalog() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: syncCatalogWithOmie,
    onSuccess: (result) => {
      if (result.success) {
        success('Sincronização iniciada com sucesso.');
      } else {
        error(result.error);
      }
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : 'Erro ao sincronizar catálogo');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products-raw'] });
    }
  });
}

export function useSyncStock() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: syncStockWithOmie,
    onSuccess: (result) => {
      if (result.success) {
        success('Estoque atualizado com sucesso.');
        
        queryClient.setQueryData(['products-raw'], (oldData: any) => {
          if (!oldData || !oldData.data || !Array.isArray(oldData.data)) return oldData;
          
          const newStockMap = new Map();
          if (Array.isArray(result.data)) {
             result.data.forEach((s: any) => newStockMap.set(s.code, s));
          } else if (result.data && Array.isArray(result.data.data)) {
             result.data.data.forEach((s: any) => newStockMap.set(s.code, s));
          }
          
          const updatedProducts = oldData.data.map((p: any) => {
             const freshStock = newStockMap.get(p.code);
             if (freshStock) {
               return { ...p, stock: freshStock.stock, minStock: freshStock.minStock };
             }
             return p;
          });
          
          return { ...oldData, data: updatedProducts };
        });
      } else {
        error(result.error);
      }
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : 'Erro ao atualizar estoque');
    }
  });
}
