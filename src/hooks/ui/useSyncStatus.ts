import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { catalogDb } from '../../features/catalog/infra/CatalogDB';
import { sectorsDb } from '../../features/sectors/infra/SectorsDB';
import { planningDb } from '../../features/planner/infra/PlanningDB';
import { goalsDb } from '../../features/goals/infra/GoalsDB';

export function useSyncStatus() {
  const pendingCounts = useLiveQuery(async () => {
    try {
      const pProduced = await db.produced.filter(r => !r.synced).count();
      const pPlanning = await planningDb.items.filter(r => !r.synced).count();
      const pCatalog = await catalogDb.products.filter(r => !r.synced).count();
      const pSectors = await sectorsDb.sectors.filter(r => !r.synced).count();
      const pGoals = await goalsDb.goals.filter(r => !r.synced).count();
      
      return pProduced + pPlanning + pCatalog + pSectors + pGoals;
    } catch (e) {
      console.error('Dexie count error:', e);
      return 0;
    }
  }, []);

  const lastSync = useLiveQuery(async () => {
    try {
      const pLatest = await db.produced.orderBy('updatedAt').reverse().first();
      const plLatest = await planningDb.items.orderBy('lastModified').reverse().first();
      const pcLatest = await catalogDb.products.orderBy('lastModified').reverse().first();
      const psLatest = await sectorsDb.sectors.orderBy('lastModified').reverse().first();
      const pgLatest = await goalsDb.goals.orderBy('lastModified').reverse().first();
      
      const dates: number[] = [];
      if (pLatest?.updatedAt) dates.push(new Date(pLatest.updatedAt).getTime());
      if (plLatest?.lastModified) dates.push(plLatest.lastModified);
      if (pcLatest?.lastModified) dates.push(pcLatest.lastModified);
      if (psLatest?.lastModified) dates.push(psLatest.lastModified);
      if (pgLatest?.lastModified) dates.push(pgLatest.lastModified);
        
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
