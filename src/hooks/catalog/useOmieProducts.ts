import { useQuery } from '@tanstack/react-query';
import { getOmieProducts } from '../../features/catalog';

export function useOmieProducts() {
  return useQuery({
    queryKey: ['products-raw'],
    queryFn: getOmieProducts,
    staleTime: 1000 * 60 * 10, 
  });
}
