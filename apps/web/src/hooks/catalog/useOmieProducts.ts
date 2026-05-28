import { useQuery } from '@tanstack/react-query';
import { getOmieProducts } from '../../features/catalog';

export function useOmieProducts() {
  const query = useQuery({
    queryKey: ['products-raw'],
    queryFn: getOmieProducts,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : [],
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
