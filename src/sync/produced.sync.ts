import { db } from '../db';
import { markProducedAsSynced } from '../features/production';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/endpoints';

export async function syncProducedToBackend() {
  const unsynced = await db.produced.where('synced').equals(0).toArray();

  if (unsynced.length === 0) return;

  console.log(`[Sync] Sincronizando ${unsynced.length} registros de produção...`);

  for (const record of unsynced) {
    try {
      await apiClient.post(ENDPOINTS.DASHBOARD.PRODUCED, record);
      await markProducedAsSynced(record.id);
      console.log(`[Sync] Registro ${record.id} sincronizado com sucesso.`);
    } catch (error) {
      console.error(`[Sync] Erro ao sincronizar registro ${record.id}:`, error);
    }
  }
}

export function initSyncService() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[Sync] Dispositivo online, iniciando sincronização...');
    syncProducedToBackend();
  });

  setInterval(() => {
    syncProducedToBackend();
  }, 30000);

  syncProducedToBackend();
}