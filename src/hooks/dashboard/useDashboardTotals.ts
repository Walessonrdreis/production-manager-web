import { useQuery } from '@tanstack/react-query';
import { getStage20Totals } from '../../features/dashboard';

export function useDashboardTotals() {
  const query = useQuery({
    queryKey: ['stage20-totals'],
    queryFn: getStage20Totals,
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
