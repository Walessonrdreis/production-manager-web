import { useQuery } from '@tanstack/react-query';
import { getOmieProducts } from '../../features/catalog';

export function useOmieProducts() {
  const query = useQuery({
    queryKey: ['products-raw'],
    queryFn: getOmieProducts,
    staleTime: 1000 * 60 * 10, 
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : [],
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
