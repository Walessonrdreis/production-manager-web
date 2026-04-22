import { create } from 'zustand';
import { Product } from '../../types/api';

export interface PlanningItem extends Product {
  plannedQuantity: number;
  notes?: string;
}

interface PlanningStore {
  items: PlanningItem[];
  period: 'daily' | 'weekly' | 'monthly';
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  clear: () => void;
}

export const usePlanningStore = create<PlanningStore>((set) => ({
  items: [],
  period: 'daily',
  addItem: (product, quantity) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if(existing) {
        return {
            items: state.items.map(i => i.id === product.id ? { ...i, plannedQuantity: i.plannedQuantity + quantity } : i)
        };
    }
    return { items: [...state.items, { ...product, plannedQuantity: quantity }] };
  }),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, plannedQuantity: Math.max(1, quantity) } : i)
  })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  setPeriod: (period) => set({ period }),
  clear: () => set({ items: [] }),
}));

export function usePlanning() {
  const store = usePlanningStore();
  return {
    items: store.items,
    period: store.period,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    setPeriod: store.setPeriod,
    clearPlanning: store.clear,
  };
}
