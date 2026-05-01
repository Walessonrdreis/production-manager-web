import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { useState } from 'react';
import { 
  addPlanningItem, 
  addBulkPlanningItems,
  updatePlanningItem, 
  removePlanningItem, 
  clearPlanning,
  getPlanningItems
} from '../../features/planner';
import { Product } from '../../types/api';
import { useToast } from '../../components/ui/Toast';

export function usePlanning() {
  const { success, error: toastError } = useToast();
  const rawItems = useLiveQuery(() => db.planning.toArray());
  const items = rawItems || [];

  const [period, setPeriodState] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const addItem = async (product: Product, quantity: number, sectorId: string, sectorName: string) => {
    const result = await addPlanningItem(product, quantity, sectorId, sectorName);
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Item adicionado ao planejamento.');
    }
    return result;
  };

  const addBulkItems = async (products: Product[], sectorId: string, sectorName: string) => {
    const result = await addBulkPlanningItems(products, sectorId, sectorName);
    if (!result.success) {
      toastError(result.error);
    } else {
      success(`${products.length} itens adicionados.`);
    }
    return result;
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    const result = await updatePlanningItem(id, quantity);
    if (!result.success) {
      toastError(result.error);
    }
    return result;
  };

  const removeItem = async (id: string | number) => {
    const result = await removePlanningItem(id);
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Item removido do planejamento.');
    }
    return result;
  };

  const clear = async () => {
    const result = await clearPlanning();
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Planejamento limpo.');
    }
    return result;
  };

  return {
    items,
    isLoading: rawItems === undefined,
    error: null,
    addItem,
    addBulkItems,
    updateQuantity,
    removeItem,
    clearPlanning: clear,
    period,
    setPeriod: (p: 'daily' | 'weekly' | 'monthly') => setPeriodState(p),
  };
}
