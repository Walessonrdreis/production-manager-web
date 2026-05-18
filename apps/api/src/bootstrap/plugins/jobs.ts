import cron from 'node-cron';
import { SyncOrdersUseCase } from '../../modules/orders/application/use-cases/SyncOrdersUseCase.js';
import { SyncCatalogUseCase } from '../../modules/catalog/application/use-cases/SyncCatalogUseCase.js';
// import { SyncClientsUseCase } from '../../modules/clients/application/use-cases/SyncClientsUseCase.js';

export function startBackgroundJobs() {
  console.log('[JOBS] Initializing background jobs...');

  // Sync everything sequentially to avoid Rate Limits (429) & cascade 500 errors
  const runAllSyncs = async () => {
    try {
      console.log('[JOBS] Syncing data from Render API to Firebase sequentially...');
      
      try {
        await SyncOrdersUseCase.execute(1, 200);
      } catch (err: any) {
        console.error('[JOBS] Error syncing orders:', err.message);
      }
      
      try {
        await SyncCatalogUseCase.execute();
      } catch (err: any) {
        console.error('[JOBS] Error syncing catalog:', err.message);
      }

      console.log('[JOBS] Synchronization cycle complete.');
    } catch (err: any) {
      console.error('[JOBS] Error in synchronization cycle:', err.message);
    }
  };

  // Delay the initial sync to avoid blocking boot and giving the Render API time to respond, without tying up initial resources
  setTimeout(() => {
    runAllSyncs().catch(err => console.error('[JOBS] Unhandled error in runAllSyncs on start:', err));
  }, 15000); // Wait 15 seconds after boot

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

