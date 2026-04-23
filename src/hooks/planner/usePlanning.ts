import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { Product, Planning } from '../../types/api';

export function usePlanning() {
  const queryClient = useQueryClient();

  const planningQuery = useQuery({
    queryKey: ['planning'],
    queryFn: async (): Promise<Planning[]> => {
      const { data } = await apiClient.get(ENDPOINTS.PLANNING.BASE);
      return Array.isArray(data) ? data : [];
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ product, quantity }: { product: Product, quantity: number }) => {
      const existing = planningQuery.data?.find(i => i.productId === product.id);
      if (existing) {
        return await apiClient.patch(`${ENDPOINTS.PLANNING.BASE}/${existing.id}`, {
          plannedQuantity: (existing.plannedQuantity || 0) + quantity
        });
      }
      return await apiClient.post(ENDPOINTS.PLANNING.BASE, {
        ...product,
        productId: product.id,
        plannedQuantity: quantity,
        status: 'planned'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string, quantity: number }) => {
      return await apiClient.patch(`${ENDPOINTS.PLANNING.BASE}/${id}`, {
        plannedQuantity: Math.max(1, quantity)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`${ENDPOINTS.PLANNING.BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    }
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      // In a real API would be a batch delete, here we have to do it for each or provide an endpoint
      // For the mock, we can just fetch all and delete
      const items = planningQuery.data || [];
      for (const item of items) {
        await apiClient.delete(`${ENDPOINTS.PLANNING.BASE}/${item.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    }
  });

  const [period, setPeriodState] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return {
    items: planningQuery.data || [],
    isLoading: planningQuery.isLoading,
    addItem: (product: Product, quantity: number) => addItemMutation.mutate({ product, quantity }),
    updateQuantity: (id: string, quantity: number) => updateQuantityMutation.mutate({ id, quantity }),
    removeItem: (id: string) => removeItemMutation.mutate(id),
    clearPlanning: () => clearMutation.mutate(),
    period,
    setPeriod: (p: 'daily' | 'weekly' | 'monthly') => setPeriodState(p),
  };
}
