import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

export function useSyncStatus() {
  const pendingCounts = useLiveQuery(async () => {
    try {
      const pProduced = await db.produced.filter(r => !r.synced).count();
      const pPlanning = await db.planning.filter(r => !r.synced).count();
      return pProduced + pPlanning;
    } catch (e) {
      console.error('Dexie count error:', e);
      return 0;
    }
  }, []);

  const lastSync = useLiveQuery(async () => {
    try {
      const pLatest = await db.produced.orderBy('updatedAt').reverse().first();
      const plLatest = await db.planning.orderBy('updatedAt').reverse().first();
      
      const dates: number[] = [];
      if (pLatest?.updatedAt) dates.push(new Date(pLatest.updatedAt).getTime());
      if (plLatest?.updatedAt) dates.push(new Date(plLatest.updatedAt).getTime());
        
      if (dates.length === 0) return null;
      return new Date(Math.max(...dates));
    } catch (e) {
      console.error('Dexie order error:', e);
      return null;
    }
  }, []);

  return {
    pendingCount: pendingCounts || 0,
    isSynced: (pendingCounts || 0) === 0,
    lastSync
  };
}
