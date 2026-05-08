import { useQuery } from '@tanstack/react-query';
import { getProductionTotals } from '../../features/production';

export function useDashboardTotals() {
  const query = useQuery({
    queryKey: ['stage20-totals'],
    queryFn: getProductionTotals,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : null,
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
