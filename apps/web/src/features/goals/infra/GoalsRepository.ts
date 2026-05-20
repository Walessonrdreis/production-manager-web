import { ProductionGoal } from '../domain/Goal';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { goalRepository } from './GoalIndexedDBRepo';

export const GoalsRepository = {
  async getAll(): Promise<ProductionGoal[]> {
    try {
      const response = await apiClient.get<{ success: boolean, data: ProductionGoal[] }>(ENDPOINTS.GOALS.BASE);
      if (response.data && response.data.success && response.data.data) {
        const goals = response.data.data;
        
        // Cache local backup em background (silencioso)
        setTimeout(() => {
          goals.forEach((goal) => {
            goalRepository.save({
              ...goal,
              synced: true,
              lastModified: Date.now()
            }).catch(() => {});
          });
        }, 0);

        return goals;
      }
      return [];
    } catch (error) {
      console.error('[GoalsRepository] Falha ao buscar dados da API, tentando Cache Local:', error);
      try {
        const localGoals = await goalRepository.getAll();
        if (localGoals && localGoals.length > 0) {
          return localGoals;
        }
      } catch (localErr) {
        console.error('[GoalsRepository] Falha ao buscar dados do Cache Local:', localErr);
      }
      return [];
    }
  },

  async save(goal: ProductionGoal): Promise<ProductionGoal> {
    try {
      const toSave = { ...goal, synced: true, lastModified: Date.now() };
      
      const response = await apiClient.post(ENDPOINTS.GOALS.BASE, toSave);
      if (response.data?.data) {
        return response.data.data;
      }
      
      return toSave;
    } catch (error) {
      console.error('[GoalsRepository] Erro ao persistir meta na API:', error);
      return goal; 
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.GOALS.BASE}/${id}`);
    } catch (error) {
      console.error('[GoalsRepository] Erro ao deletar meta na API:', error);
    }
  },

  async update(id: string, data: Partial<ProductionGoal>): Promise<void> {
    try {
      await apiClient.put(`${ENDPOINTS.GOALS.BASE}/${id}`, data);
    } catch (error) {
      console.error('[GoalsRepository] Erro ao atualizar meta na API:', error);
    }
  }
};
