import { useQuery } from '@tanstack/react-query';
import { getSectors } from '../../features/sectors';

export function useSectors() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
  });
}
