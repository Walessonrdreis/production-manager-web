import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../types/api';

export function useDashboard() {
  const queryClient = useQueryClient();

  const totalsQuery = useQuery({
    queryKey: ['stage20-totals'],
    queryFn: async (): Promise<DashboardTotalsResponse> => {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
      const rawData = response.data;
      
      const products = Array.isArray(rawData) ? rawData : (rawData.data || []);
      const totalUnits = products.reduce((acc: number, curr: any) => acc + (curr.totalQuantity || 0), 0);

      return {
        data: products,
        totalItems: totalUnits,
        lastUpdate: new Date().toISOString()
      };
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const syncMutation = useMutation({
    mutationFn: async (): Promise<{ message: string; count: number }> => {
      const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stage20-totals'] });
    },
  });

  return {
    totals: totalsQuery.data,
    isLoading: totalsQuery.isLoading,
    isError: totalsQuery.isError,
    error: totalsQuery.error,
    isFetching: totalsQuery.isFetching,
    refetchTotals: totalsQuery.refetch,
    syncStage20: syncMutation,
  };
}
