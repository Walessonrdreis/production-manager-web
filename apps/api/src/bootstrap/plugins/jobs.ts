import cron from 'node-cron';
import { SyncOrdersUseCase } from '../../modules/orders/application/use-cases/SyncOrdersUseCase.js';
import { SyncProductsUseCase } from '../../modules/products/application/use-cases/SyncProductsUseCase.js';
import { SyncClientsUseCase } from '../../modules/clients/application/use-cases/SyncClientsUseCase.js';

export function startBackgroundJobs() {
  console.log('[JOBS] Initializing background jobs...');

  // Sync everything to Firebase
  const runAllSyncs = async () => {
    try {
      console.log('[JOBS] Syncing data from Render API to Firebase...');
      await Promise.all([
        SyncOrdersUseCase.execute(1, 200).catch(err => console.error('[JOBS] Error syncing orders:', err.message)),
        SyncProductsUseCase.execute().catch(err => console.error('[JOBS] Error syncing products:', err.message)),
        SyncClientsUseCase.execute().catch(err => console.error('[JOBS] Error syncing clients:', err.message))
      ]);
      console.log('[JOBS] Synchronization cycle complete.');
    } catch (err: any) {
      console.error('[JOBS] Error in synchronization cycle:', err.message);
    }
  };

  // Run immediately on start
  runAllSyncs();

  // Schedule to run every 10 minutes
  cron.schedule('*/10 * * * *', () => {
    runAllSyncs();
  });
}

