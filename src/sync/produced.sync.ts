import { db } from '../db';
import { catalogDb } from '../features/catalog/infra/CatalogDB';
import { sectorsDb } from '../features/sectors/infra/SectorsDB';
import { planningDb } from '../features/planner/infra/PlanningDB';
import { goalsDb } from '../features/goals/infra/GoalsDB';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/endpoints';

let isSyncing = false;

export async function syncAllToBackend() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const produced = await db.produced.filter(r => !r.synced).toArray();
    const planning = await planningDb.items.filter(r => !r.synced).toArray();
    const products = await catalogDb.products.filter(r => !r.synced).toArray();
    const sectors = await sectorsDb.sectors.filter(r => !r.synced).toArray();
    const goals = await goalsDb.goals.filter(r => !r.synced).toArray();

    const totalUnsynced = produced.length + planning.length + products.length + sectors.length + goals.length;

    if (totalUnsynced === 0) {
      isSyncing = false;
      return;
    }

    console.log(`[Sync] Sincronizando ${totalUnsynced} registros pendentes...`);

    for (const p of produced) {
      try {
        await apiClient.post(ENDPOINTS.PRODUCTION.PRODUCED, p);
        await db.produced.update(p.id, { synced: true });
        console.log(`[Sync] Produzido ${p.id} sincronizado com sucesso.`);
      } catch (err) {
        console.error(`[Sync] Erro ao sincronizar Produzido ${p.id}:`, err);
      }
    }

    for (const p of planning) {
      try {
        await apiClient.post(ENDPOINTS.PLANNING.BASE, p);
        await planningDb.items.update(p.id, { synced: true, version: (p.version || 1) + 1 });
        console.log(`[Sync] Planejamento ${p.id} sincronizado com sucesso.`);
      } catch (err) {
        console.error(`[Sync] Erro ao sincronizar Planejamento ${p.id}:`, err);
      }
    }

    for (const p of products) {
      try {
        await apiClient.post(ENDPOINTS.PRODUCTS.ADMIN, p);
        await catalogDb.products.update(p.id, { synced: true, version: (p.version || 1) + 1 });
        console.log(`[Sync] Produto ${p.id} sincronizado com sucesso.`);
      } catch (err) {
        console.error(`[Sync] Erro ao sincronizar Produto ${p.id}:`, err);
      }
    }

    for (const s of sectors) {
      try {
        await apiClient.post(ENDPOINTS.SECTORS.BASE, s);
        await sectorsDb.sectors.update(s.id, { synced: true, version: (s.version || 1) + 1 });
        console.log(`[Sync] Setor ${s.id} sincronizado com sucesso.`);
      } catch (err) {
        console.error(`[Sync] Erro ao sincronizar Setor ${s.id}:`, err);
      }
    }

    for (const g of goals) {
      try {
        await apiClient.post(ENDPOINTS.GOALS.BASE, g);
        await goalsDb.goals.update(g.id, { synced: true, version: (g.version || 1) + 1 });
        console.log(`[Sync] Meta ${g.id} sincronizada com sucesso.`);
      } catch (err) {
        console.error(`[Sync] Erro ao sincronizar Meta ${g.id}:`, err);
      }
    }

  } catch (error) {
    console.error(`[Sync] Erro geral ao sincronizar:`, error);
  }

  isSyncing = false;
}

export function initSyncService() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[Sync] Dispositivo online, iniciando sincronização...');
    syncAllToBackend();
  });

  setInterval(() => {
    if (navigator.onLine) {
        syncAllToBackend();
    }
  }, 10000); // 10 seconds

  syncAllToBackend();
}
