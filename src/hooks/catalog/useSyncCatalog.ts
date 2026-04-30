import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncCatalogWithOmie } from '../../features/catalog';
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
