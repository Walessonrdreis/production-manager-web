export function useSyncStatus() {
  return {
    pendingCount: 0,
    isSynced: true,
    lastSync: new Date()
  };
}
