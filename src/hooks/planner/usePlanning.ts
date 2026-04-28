import { useLiveQuery } from 'dexie-react-hooks';
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

export function usePlanning() {
  const items = useLiveQuery(() => getPlanningItems()) || [];

  const [period, setPeriodState] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const addItem = async (product: Product, quantity: number) => {
    await addPlanningItem(product, quantity);
  };

  const addBulkItems = async (products: Product[]) => {
    await addBulkPlanningItems(products);
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    await updatePlanningItem(id, quantity);
  };

  const removeItem = async (id: string | number) => {
    await removePlanningItem(id);
  };

  const clear = async () => {
    await clearPlanning();
  };

  return {
    items,
    isLoading: items === undefined,
    addItem,
    addBulkItems,
    updateQuantity,
    removeItem,
    clearPlanning: clear,
    period,
    setPeriod: (p: 'daily' | 'weekly' | 'monthly') => setPeriodState(p),
  };
}
