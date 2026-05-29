import { useState, useEffect } from 'react';

export type Subpage = 'none' | 'opened' | 'create' | 'live' | 'review' | 'history' | 'metrics';

const defaultOrder: Subpage[] = ['opened', 'create', 'live', 'review', 'history', 'metrics'];

export function useProductionOrdersLayout() {
  const [activeSubpage, setActiveSubpage] = useState<Subpage>('none');
  const [blocksOrder, setBlocksOrder] = useState<Subpage[]>(() => {
    try {
      const saved = localStorage.getItem('production-orders-blocks-order');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse blocks order from local storage', e);
    }
    return defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('production-orders-blocks-order', JSON.stringify(blocksOrder));
  }, [blocksOrder]);
  
  const openSubpage = (page: Subpage) => setActiveSubpage(page);
  const closeSubpage = () => setActiveSubpage('none');
  
  const reorderBlocks = (newOrder: Subpage[]) => {
    setBlocksOrder(newOrder);
  };

  return { activeSubpage, openSubpage, closeSubpage, blocksOrder, reorderBlocks };
}

