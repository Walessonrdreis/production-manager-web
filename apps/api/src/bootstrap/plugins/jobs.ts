import cron from 'node-cron';
import { SyncOrdersUseCase } from '../../modules/orders/application/use-cases/SyncOrdersUseCase.js';
import { SyncCatalogUseCase } from '../../modules/catalog/application/use-cases/SyncCatalogUseCase.js';
// import { SyncClientsUseCase } from '../../modules/clients/application/use-cases/SyncClientsUseCase.js';

export function startBackgroundJobs() {
  console.log('[JOBS] Background jobs are temporarily disabled.');
  return;
}

