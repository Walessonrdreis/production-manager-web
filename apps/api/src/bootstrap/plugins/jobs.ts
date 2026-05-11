import cron from 'node-cron';
import { SyncOrdersUseCase } from '../../modules/orders/application/use-cases/SyncOrdersUseCase.js';
import { SyncCatalogUseCase } from '../../modules/catalog/application/use-cases/SyncCatalogUseCase.js';
// import { SyncClientsUseCase } from '../../modules/clients/application/use-cases/SyncClientsUseCase.js';

export function startBackgroundJobs() {
  console.log('[JOBS] Initializing background jobs...');

  // Sync everything to Firebase
  const runAllSyncs = async () => {
    try {
      console.log('[JOBS] Syncing data from Render API to Firebase...');
      await Promise.all([
        SyncOrdersUseCase.execute(1, 200).catch(err => console.error('[JOBS] Error syncing orders:', err.message)),
        SyncCatalogUseCase.execute().catch(err => console.error('[JOBS] Error syncing catalog:', err.message)),
        // SyncClientsUseCase.execute().catch(err => console.error('[JOBS] Error syncing clients:', err.message))
      ]);
      console.log('[JOBS] Synchronization cycle complete.');
    } catch (err: any) {
      console.error('[JOBS] Error in synchronization cycle:', err.message);
    }
  };

  // Run immediately on start
  runAllSyncs().catch(err => console.error('[JOBS] Unhandled error in runAllSyncs on start:', err));

  // Schedule Orders sync to run more frequently (e.g., every 3 minutes)
  cron.schedule('*/3 * * * *', async () => {
    try {
      console.log('[JOBS] Syncing orders from Render API to Firebase...');
      await SyncOrdersUseCase.execute(1, 200);
      console.log('[JOBS] Orders synchronization cycle complete.');
    } catch (err: any) {
      console.error('[JOBS] Error syncing orders:', err.message);
    }
  });

  // Schedule Catalog sync to run less frequently (e.g., every 15 minutes)
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('[JOBS] Syncing catalog from Render API to Firebase...');
      await SyncCatalogUseCase.execute();
      console.log('[JOBS] Catalog synchronization cycle complete.');
    } catch (err: any) {
      console.error('[JOBS] Error syncing catalog:', err.message);
    }
  });
}

