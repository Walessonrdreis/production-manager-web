import { useLiveQuery } from 'dexie-react-hooks';
import { 
  getPlanningItems,
  addPlanningItemRaw,
  addBulkPlanningItemsRaw,
  updatePlanningItem as updateUseCase,
  removePlanningItem as removeUseCase
} from '../../features/planner';
import { type PlanningItem } from '../../db/models';

export function useLocalPlanning() {
  const planningItems = useLiveQuery(() => getPlanningItems());

  const addPlanningItem = async (item: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>) => {
    return await addPlanningItemRaw(item);
  };

  const updatePlanningItem = async (id: string, updates: Partial<PlanningItem>) => {
    await updateUseCase(id, updates.quantity || 0);
  };

  const deletePlanningItem = async (id: string) => {
    await removeUseCase(id);
  };

  const addBulkPlanningItems = async (items: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[]) => {
    return await addBulkPlanningItemsRaw(items);
  };

  return {
    planningItems: planningItems || [],
    isLoading: planningItems === undefined,
    addPlanningItem,
    updatePlanningItem,
    deletePlanningItem,
    addBulkPlanningItems
  };
}
