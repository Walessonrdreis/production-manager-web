export interface PendingItem {
  id: string;
  type: 'produced' | 'planning' | 'catalog' | 'sector' | 'goal';
  title: string;
  subtitle?: string;
  timestamp?: string | number;
  rawItem: any;
}

export function usePendingDetails() {
  const syncAllPending = async () => {
    // Firebase already handles synchronizing anything offline when it connects.
    return Promise.resolve();
  };

  return {
    items: [],
    count: 0,
    isEmpty: true,
    syncAllPending
  };
}

