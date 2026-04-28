import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardTotalsResponse } from '../../types/api';
import { 
  getStage20Totals, 
  syncStage20 as syncStage20UseCase, 
  getProducedRecords,
  addProducedRecord,
  removeProducedRecord
} from '../../features/dashboard';

export function useDashboard() {
  const queryClient = useQueryClient();

  const totalsQuery = useQuery({
    queryKey: ['stage20-totals'],
    queryFn: getStage20Totals,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const syncMutation = useMutation({
    mutationFn: syncStage20UseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stage20-totals'] });
    },
  });

  const producedQuery = useQuery({
    queryKey: ['dashboard-produced'],
    queryFn: getProducedRecords
  });

  const toggleProducedMutation = useMutation({
    mutationFn: async ({ description, quantity, action }: { description: string, quantity: number, action: 'add' | 'remove' }) => {
      if (action === 'add') {
        return await addProducedRecord(description, quantity);
      } else {
        const item = producedQuery.data?.find(i => i.description === description);
        if (item) {
          return await removeProducedRecord(item.id);
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
