import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { db } from '../../lib/db';
import { Product } from '../../types/api';

export function usePlanning() {
  const items = useLiveQuery(() => db.planningItems.toArray()) || [];

  const [period, setPeriodState] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const addItem = async (product: Product, quantity: number) => {
    const existing = items.find(i => i.productId === product.id);
    if (existing) {
      await db.planningItems.update(existing.id, {
        plannedQuantity: (existing.plannedQuantity || 0) + quantity
      });
    } else {
      await db.planningItems.add({
        ...product,
        productId: product.id,
        plannedQuantity: quantity,
        status: 'planned'
      } as any);
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    await db.planningItems.update(id, {
      plannedQuantity: Math.max(1, quantity)
    });
  };

  const removeItem = async (id: string | number) => {
    await db.planningItems.delete(id);
  };

  const clearPlanning = async () => {
    await db.planningItems.clear();
  };

  return {
    items,
    isLoading: items === undefined,
    addItem,
    updateQuantity,
    removeItem,
    clearPlanning,
    period,
    setPeriod: (p: 'daily' | 'weekly' | 'monthly') => setPeriodState(p),
  };
}
