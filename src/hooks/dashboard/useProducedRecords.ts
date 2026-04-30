import { useQuery } from '@tanstack/react-query';
import { getProducedRecords } from '../../features/dashboard';

export function useProducedRecords() {
  const query = useQuery({
    queryKey: ['dashboard-produced'],
    queryFn: getProducedRecords
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : [],
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
