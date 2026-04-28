import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../types/api';
import { getOmieProducts, syncCatalogWithOmie } from '../../features/catalog';

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products-raw'],
    queryFn: getOmieProducts,
    staleTime: 1000 * 60 * 10, 
  });

  const syncMutation = useMutation({
    mutationFn: syncCatalogWithOmie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-raw'] });
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isFetching: productsQuery.isFetching,
    refetchProducts: productsQuery.refetch,
    syncWithOmie: syncMutation,
  };
}
