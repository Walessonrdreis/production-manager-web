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

  const producedQuery = useQuery({
    queryKey: ['dashboard-produced'],
    queryFn: async (): Promise<any[]> => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.PRODUCED);
      return Array.isArray(data) ? data : [];
    }
  });

  const toggleProducedMutation = useMutation({
    mutationFn: async ({ description, quantity, action }: { description: string, quantity: number, action: 'add' | 'remove' }) => {
      if (action === 'add') {
        return await apiClient.post(ENDPOINTS.DASHBOARD.PRODUCED, { description, quantity });
      } else {
        const item = producedQuery.data?.find(i => i.description === description);
        if (item) {
          return await apiClient.delete(`${ENDPOINTS.DASHBOARD.PRODUCED}/${item.id}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-produced'] });
    }
  });

  return {
    totals: totalsQuery.data,
    producedRecords: producedQuery.data || [],
    isLoading: totalsQuery.isLoading || producedQuery.isLoading,
    isError: totalsQuery.isError,
    error: totalsQuery.error,
    isFetching: totalsQuery.isFetching || producedQuery.isFetching,
    refetchTotals: totalsQuery.refetch,
    syncStage20: syncMutation,
    toggleProduced: toggleProducedMutation
  };
}
