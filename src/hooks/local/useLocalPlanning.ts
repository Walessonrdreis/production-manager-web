import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { PlanningRepository } from '../../repositories/planning.repo';
import { type PlanningItem } from '../../db/models';

export function useLocalPlanning() {
  const planningItems = useLiveQuery(() => db.planning.toArray());

  const addPlanningItem = async (item: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>) => {
    return await PlanningRepository.add(item);
  };

  const updatePlanningItem = async (id: string, updates: Partial<PlanningItem>) => {
    await PlanningRepository.update(id, updates);
  };

  const deletePlanningItem = async (id: string) => {
    await PlanningRepository.delete(id);
  };

  const addBulkPlanningItems = async (items: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[]) => {
    return await PlanningRepository.bulkAdd(items);
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
