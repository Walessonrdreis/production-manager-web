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
        queryClient.invalidateQueries({ queryKey: ['products-raw'] });
      } else {
        error(result.error);
      }
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : 'Erro ao sincronizar catálogo');
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
        queryClient.invalidateQueries({ queryKey: ['products-raw'] });
      } else {
        error(result.error);
      }
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : 'Erro ao atualizar estoque');
    }
  });
}
