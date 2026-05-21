import cron from 'node-cron';
import { SyncOrdersUseCase } from '../../modules/orders/application/use-cases/SyncOrdersUseCase.js';
import { SyncCatalogUseCase } from '../../modules/catalog/application/use-cases/SyncCatalogUseCase.js';
// import { SyncClientsUseCase } from '../../modules/clients/application/use-cases/SyncClientsUseCase.js';

export function startBackgroundJobs() {
  console.log('[JOBS] Initializing background jobs (Cron)...');

  // Cron = Minuto Hora Dia Mês DiaDaSemana

  // 1. Sincronização de Catálogo (A cada 2 horas)
  cron.schedule('0 */2 * * *', async () => {
    try {
      console.log('[CRON] Iniciando sincronização programada de Catálogo...');
      await SyncCatalogUseCase.execute();
      console.log('[CRON] Sincronização de Catálogo concluída com sucesso.');
    } catch (err: any) {
      console.error('[CRON ERROR] Falha na sincronização de Catálogo:', err.message);
    }
  });

  // 2. Sincronização de Pedidos (A cada 30 minutos)
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('[CRON] Iniciando sincronização programada de Pedidos...');
      // Executa buscando as ultimas 200 orders na pagina 1
      await SyncOrdersUseCase.execute(1, 200); 
      console.log('[CRON] Sincronização de Pedidos concluída com sucesso.');
    } catch (err: any) {
      console.error('[CRON ERROR] Falha na sincronização de Pedidos:', err.message);
    }
  });

  console.log('[JOBS] Cron jobs scheduled successfully. (Pedidos: 30m, Catálogo: 2h)');
}


