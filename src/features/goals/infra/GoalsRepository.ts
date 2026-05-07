import { ProductionGoal } from '../domain/Goal';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { goalRepository as localRepo } from './GoalIndexedDBRepo';

export const GoalsRepository = {
  async getAll(): Promise<ProductionGoal[]> {
    try {
      // Busca do Proxy Local / API
      const { data: apiGoals } = await apiClient.get<ProductionGoal[]>(ENDPOINTS.GOALS.BASE);
      
      if (Array.isArray(apiGoals)) {
        // Sincronização Local-First: O Servidor manda.
        const localGoals = await localRepo.getAll();
        const apiIds = new Set(apiGoals.map(g => g.id));
        
        // 1. Remove locais que não existem mais na API e que JÁ ESTAVAM sincronizados (Sync de Deletados)
        for (const local of localGoals) {
          if (!apiIds.has(local.id) && local.synced) {
            await localRepo.delete(local.id);
          }
        }
        
        // 2. Salva/Atualiza com dados da API
        for (const apiGoal of apiGoals) {
          await localRepo.save({
            ...apiGoal,
            synced: true,
            lastModified: Date.now()
          });
        }
        
        return apiGoals;
      }
    } catch (error) {
      console.warn('[GoalsRepository] Falha ao sincronizar com API, usando cache local:', error);
    }
    
    return localRepo.getAll();
  },

  async save(goal: ProductionGoal): Promise<ProductionGoal> {
    // 1. Salva localmente como unsynced
    const toSave = { ...goal, synced: false, lastModified: Date.now() };
    await localRepo.save(toSave);
    
    // 2. Tenta persistir no Proxy/API
    try {
      await apiClient.post(ENDPOINTS.GOALS.BASE, toSave);
      await localRepo.save({ ...toSave, synced: true });
    } catch (error) {
      console.error('[GoalsRepository] Erro ao persistir meta na API:', error);
    }
    
    return toSave;
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.GOALS.BASE}/${id}`);
    } catch (error) {
      console.error('[GoalsRepository] Erro ao deletar meta na API:', error);
    }
    await localRepo.delete(id);
  },

  async update(id: string, data: Partial<ProductionGoal>): Promise<void> {
    const existing = await localRepo.getById(id);
    if (!existing) return;

    const updated = { ...existing, ...data, synced: false, lastModified: Date.now() };
    await localRepo.save(updated);

    try {
      await apiClient.patch(`${ENDPOINTS.GOALS.BASE}/${id}`, data);
      await localRepo.save({ ...updated, synced: true });
    } catch (error) {
      console.error('[GoalsRepository] Erro ao atualizar meta na API:', error);
    }
  }
};
