// Firebase and offline sync functionalities have been migrated to use direct API communication.
// These functions are kept for compatibility if any other piece of the code calls them.

export async function syncAllToBackend() {
  return Promise.resolve();
}

export function initSyncService() {
  console.log('[Sync] Servico de sincronizacao inicializado em modo relacional (PostgreSQL).');
}
