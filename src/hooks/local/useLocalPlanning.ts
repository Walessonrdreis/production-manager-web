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
    // Como addPlanningItem na feature espera (Product, quantity), 
    // vou precisar de um UseCase que aceite o PlanningItem bruto se o hook exigir isso.
    // O hook useLocalPlanning parece ser usado no contexto de sincronização ou importação.
    // Por enquanto, vou usar o Repository aqui se não houver UseCase correspondente, 
    // mas o ideal é criar o UseCase.
    // Já criei AddBulkPlanningItemsRaw, vou criar AddPlanningItemRaw.
    return await addPlanningItemRaw(item);
  };

  const updatePlanningItem = async (id: string, updates: Partial<PlanningItem>) => {
    await updateUseCase(id, updates.quantity || 0); // Ajustando conforme a interface do usecase
    // Note: useLocalPlanning accepts Partial<PlanningItem>, usecase accepts quantity.
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
