import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CatalogRepository } from '../../features/catalog/infra/CatalogRepository';
import { ProductionRepository } from '../../features/production/infra/ProductionRepository';

const FREQUENCY_MS = 1000 * 60 * 5; // 5 minutos (pouco tempo)

export function useAutoSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const runLightweightSync = async () => {
      try {
        queryClient.setQueryData(['sync-status'], (old: any) => ({ ...old, isSyncing: true }));
        console.log('[AUTO-SYNC] Iniciando sincronização rápida (estoque, produção e ordens)...');
        
        // Sincronizações rápidas solicitadas pelo usuário (pouco tempo)
        // 1. Orders Stage 20 (tracking)
        await ProductionRepository.syncStage20().catch(e => console.warn('Sync orders fallback:', e));
        
        // 2. Stock dos produtos (Omie)
        await CatalogRepository.syncStockWithOmie().catch(e => console.warn('Sync stock fallback:', e));
        
        // Operações como sync total de produtos e clientes devem ser feitas manualmente.
        
        console.log('[AUTO-SYNC] Sincronização rápida concluída.');
        queryClient.setQueryData(['sync-status'], { isSyncing: false, lastSync: Date.now() });
      } catch (err) {
        console.error('[AUTO-SYNC] Erro durante auto-sync:', err);
        queryClient.setQueryData(['sync-status'], (old: any) => ({ ...old, isSyncing: false }));
      }
    };

    // Store initial sync state
    queryClient.setQueryData(['sync-status'], { isSyncing: false, lastSync: Date.now() });

    const initialTimer = setTimeout(() => {
      runLightweightSync();
    }, 1000 * 15); // 15 segundos após abrir

    const intervalId = setInterval(() => {
      runLightweightSync();
    }, FREQUENCY_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [queryClient]);
}
