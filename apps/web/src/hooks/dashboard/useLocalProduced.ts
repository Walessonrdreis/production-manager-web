import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  toggleProducedOrder, 
  toggleAllProduction, 
  removeLocalProduced,
  ProducedRepository
} from '../../features/production';
import { useToast } from '../../components/ui/Toast';

export function useLocalProduced() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  
  const { data: producedRecords = [], isLoading, refetch } = useQuery({
    queryKey: ['producedRecords'],
    queryFn: () => ProducedRepository.getAll()
  });

  const toggleOrder = async (id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) => {
    // Optimistic update
    queryClient.setQueryData(['producedRecords'], (old: any) => {
      if (!old) return [];
      const exists = old.some((r: any) => r.id === id);
      if (exists) {
        return old.filter((r: any) => r.id !== id);
      } else {
        const now = new Date().toISOString();
        return [...old, { id, description, quantity, orderId, orderNumber, synced: false, updatedAt: now }];
      }
    });

    const res = await toggleProducedOrder(id, description, quantity, orderId, orderNumber);
    if (!res.success) {
      error(res.error);
      queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
    }
    await refetch();
    return res;
  };

  const toggleAll = async (description: string, totalNeeded: number) => {
    // Optimistic update
    queryClient.setQueryData(['producedRecords'], (old: any) => {
      if (!old) return [];
      const now = new Date().toISOString();
      const existing = old.filter((r: any) => r.description === description);
      const isPartiallyProduced = existing.length > 0;
      
      const newOld = old.filter((r: any) => r.description !== description);
      
      if (!isPartiallyProduced) {
        // Toggle on
        const newRecord = {
          id: `bulk-${description}-${Date.now()}`,
          description,
          quantity: totalNeeded,
          synced: false,
          updatedAt: now
        };
        return [...newOld, newRecord];
      } else {
        // Toggle off
        return newOld;
      }
    });

    const res = await toggleAllProduction(description, totalNeeded);
    if (!res.success) {
      error(res.error);
      queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
    }
    await refetch();
    return res;
  };

  const deleteProduced = async (id: string) => {
    // Optimistic update
    queryClient.setQueryData(['producedRecords'], (old: any) => {
      if (!old) return [];
      return old.filter((r: any) => r.id !== id);
    });

    const res = await removeLocalProduced(id);
    if (!res.success) {
      error(res.error);
      queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
    } else {
      success('Registro de produção removido.');
    }
    await refetch();
    return res;
  };

  return {
    producedRecords,
    isLoading,
    toggleOrder,
    toggleAll,
    deleteProduced
  };
}
