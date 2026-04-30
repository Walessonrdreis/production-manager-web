import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncCatalogWithOmie } from '../../features/catalog';

export function useSyncCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncCatalogWithOmie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-raw'] });
    },
  });
}
