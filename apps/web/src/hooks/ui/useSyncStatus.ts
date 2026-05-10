import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CatalogRepository } from '../../features/catalog/infra/CatalogRepository';
import { ProductionRepository } from '../../features/production/infra/ProductionRepository';

export function useSyncStatus() {
  const queryClient = useQueryClient();
  
  const { data } = useQuery({
    queryKey: ['sync-status'],
    queryFn: () => ({ isSyncing: false, lastSync: Date.now() }),
    initialData: { isSyncing: false, lastSync: Date.now() },
    staleTime: Infinity,
  });

  const triggerSync = async () => {
    try {
      queryClient.setQueryData(['sync-status'], (old: any) => ({ ...old, isSyncing: true }));
      await ProductionRepository.syncStage20().catch(e => console.warn(e));
      await CatalogRepository.syncStockWithOmie().catch(e => console.warn(e));
      queryClient.setQueryData(['sync-status'], { isSyncing: false, lastSync: Date.now() });
      
      // Invalidate queries so UI data re-fetches
      queryClient.invalidateQueries();
    } catch (err) {
      queryClient.setQueryData(['sync-status'], (old: any) => ({ ...old, isSyncing: false }));
    }
  };

  return {
    pendingCount: 0,
    isSynced: true,
    isSyncing: data?.isSyncing || false,
    lastSync: new Date(data?.lastSync || Date.now()),
    triggerSync
  };
}
