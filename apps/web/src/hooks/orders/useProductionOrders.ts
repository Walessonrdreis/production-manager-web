import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductionOrdersRepository } from '../../features/orders/infra/ProductionOrdersRepository';
import { ProductionOrder } from '../../features/orders/domain/ProductionOrder';

export function useProductionOrders() {
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['production_orders'],
    queryFn: () => ProductionOrdersRepository.getAll(),
  });

  const generateId = () => crypto.randomUUID();

  const createMutation = useMutation({
    mutationFn: async (newOrder: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const orderToSave: ProductionOrder = {
        ...newOrder,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      const res = await ProductionOrdersRepository.save(orderToSave);
      if (!res.success) {
        throw new Error(res.error || 'Failed to create production order');
      }
      return orderToSave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production_orders'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductionOrder> }) => {
      const res = await ProductionOrdersRepository.update(id, { ...data, updatedAt: new Date().toISOString() });
      if (!res.success) {
        throw new Error(res.error || 'Failed to update production order');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production_orders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await ProductionOrdersRepository.delete(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete production order');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production_orders'] });
    },
  });

  return {
    productionOrders: response?.data || [],
    isLoading,
    isError,
    error,
    refetchProductionOrders: refetch,
    createProductionOrder: createMutation.mutateAsync,
    updateProductionOrder: updateMutation.mutateAsync,
    deleteProductionOrder: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
