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
    }
    await queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
    await refetch();
    return res;
  };

  const toggleAll = async (ordersContainingProduct: any[], description: string) => {
    // Optimistic update
    queryClient.setQueryData(['producedRecords'], (old: any) => {
      if (!old) return [];
      const now = new Date().toISOString();
      const expectedIds = ordersContainingProduct.map(o => `order-${o.id}-${description}`);
      const existingIds = expectedIds.filter(id => old.some((r: any) => r.id === id));
      
      const isAllProduced = existingIds.length === expectedIds.length && expectedIds.length > 0;
      
      if (isAllProduced) {
        // Toggle off: remove them
        return old.filter((r: any) => !existingIds.includes(r.id));
      } else {
        // Toggle on: add missing records mapped to specific orders
        const newRecords = ordersContainingProduct
          .filter(o => !old.some((r: any) => r.id === `order-${o.id}-${description}`))
          .map(o => ({
             id: `order-${o.id}-${description}`,
             description,
             quantity: o.items?.find((i: any) => i.description === description)?.quantity || o.itemQuantity || 0,
             orderId: String(o.id),
             orderNumber: String(o.numero_pedido || o.orderNumber || o.id),
             synced: false,
             updatedAt: now
          }));
        return [...old, ...newRecords];
      }
    });

    const res = await toggleAllProduction(ordersContainingProduct, description);
    if (!res.success) {
      error(res.error);
    }
    await queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
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
    } else {
      success('Registro de produção removido.');
    }
    await queryClient.invalidateQueries({ queryKey: ['producedRecords'] });
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
