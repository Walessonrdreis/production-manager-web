import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { 
  getPlanningItems,
  addPlanningItemRaw,
  addBulkPlanningItemsRaw,
  updatePlanningItem as updateUseCase,
  removePlanningItem as removeUseCase
} from '../../features/planner';
import { type PlanningItem } from '../../db/models';

export function useLocalPlanning() {
  const queryClient = useQueryClient();
  
  const { data: planningItems = [], isLoading } = useQuery({
    queryKey: ['localPlanningItems'],
    queryFn: () => getPlanningItems()
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['localPlanningItems'] });
  }, [queryClient]);

  const addPlanningItem = async (item: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>) => {
    const res = await addPlanningItemRaw(item);
    invalidate();
    return res;
  };

  const updatePlanningItem = async (id: string, updates: Partial<PlanningItem>) => {
    await updateUseCase(id, updates.quantity || 0);
    invalidate();
  };

  const deletePlanningItem = async (id: string) => {
    await removeUseCase(id);
    invalidate();
  };

  const addBulkPlanningItems = async (items: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[]) => {
    const res = await addBulkPlanningItemsRaw(items);
    invalidate();
    return res;
  };

  return {
    planningItems,
    isLoading,
    addPlanningItem,
    updatePlanningItem,
    deletePlanningItem,
    addBulkPlanningItems
  };
}
