import { ProductionGoal } from '../domain/Goal';
import { FirebaseGoalsRepository } from './FirebaseGoalsRepository';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const GoalsRepository = {
  async getAll(): Promise<ProductionGoal[]> {
    try {
      // Prioritize Firebase since it handles real-time/auth well on the frontend
      const response = await FirebaseGoalsRepository.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to API if Firebase fails
      const apiResponse = await apiClient.get<{ success: boolean, data: ProductionGoal[] }>(ENDPOINTS.GOALS.BASE);
      if (apiResponse.data && apiResponse.data.success && apiResponse.data.data) {
        return apiResponse.data.data;
      }
      return [];
    } catch (error) {
      console.error('[GoalsRepository] Falha ao buscar dados:', error);
      return [];
    }
  },

  async save(goal: ProductionGoal): Promise<ProductionGoal> {
    try {
      const toSave = { ...goal, synced: true, lastModified: Date.now() };
      
      // Save to Firebase Database
      await FirebaseGoalsRepository.save(toSave);
      
      // Save to our Backend API
      apiClient.post(ENDPOINTS.GOALS.BASE, toSave).catch(e => console.warn('[GoalsRepo] fail API save', e));
      
      return toSave;
    } catch (error) {
      console.error('[GoalsRepository] Erro ao persistir meta:', error);
      return goal; // still return it optimistically for UI
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await FirebaseGoalsRepository.delete(id);
      apiClient.delete(`${ENDPOINTS.GOALS.BASE}/${id}`).catch(e => console.warn('[GoalsRepo] fail API del', e));
    } catch (error) {
      console.error('[GoalsRepository] Erro ao deletar meta:', error);
    }
  },

  async update(id: string, data: Partial<ProductionGoal>): Promise<void> {
    try {
      await FirebaseGoalsRepository.update(id, data);
      apiClient.put(`${ENDPOINTS.GOALS.BASE}/${id}`, data).catch(e => console.warn('[GoalsRepo] fail API update', e));
    } catch (error) {
      console.error('[GoalsRepository] Erro ao atualizar meta:', error);
    }
  }
};
