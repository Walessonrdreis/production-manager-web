// Firebase handles offline sync automatically.
// These functions are kept for compatibility if any other piece of the code calls them.

export async function syncAllToBackend() {
  return Promise.resolve();
}

export function initSyncService() {
  // Offline sync is managed internally by the Firebase Firestore SDK instance
  console.log('[Sync] Firebase Firestore is managing offline data synchronization.');
}
