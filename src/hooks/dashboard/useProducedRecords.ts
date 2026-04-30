import { useQuery } from '@tanstack/react-query';
import { getProducedRecords } from '../../features/dashboard';

export function useProducedRecords() {
  return useQuery({
    queryKey: ['dashboard-produced'],
    queryFn: getProducedRecords
  });
}
