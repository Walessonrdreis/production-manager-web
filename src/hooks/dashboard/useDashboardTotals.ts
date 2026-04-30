import { useQuery } from '@tanstack/react-query';
import { getStage20Totals } from '../../features/dashboard';

export function useDashboardTotals() {
  return useQuery({
    queryKey: ['stage20-totals'],
    queryFn: getStage20Totals,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}
