import { useQuery } from '@tanstack/react-query';
import { getSectors } from '../../features/sectors';

export function useSectors() {
  const query = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : [],
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
