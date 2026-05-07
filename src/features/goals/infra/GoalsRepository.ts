import { ProductionGoal } from '../domain/Goal';
import { FirebaseGoalsRepository } from './FirebaseGoalsRepository';

export const GoalsRepository = {
  async getAll(): Promise<ProductionGoal[]> {
    try {
      const response = await FirebaseGoalsRepository.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('[GoalsRepository] Falha ao buscar do Firebase:', error);
      return [];
    }
  },

  async save(goal: ProductionGoal): Promise<ProductionGoal> {
    try {
      const toSave = { ...goal, synced: true, lastModified: Date.now() };
      await FirebaseGoalsRepository.save(toSave);
      return toSave;
    } catch (error) {
      console.error('[GoalsRepository] Erro ao persistir meta:', error);
      return goal;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await FirebaseGoalsRepository.delete(id);
    } catch (error) {
      console.error('[GoalsRepository] Erro ao deletar meta:', error);
    }
  },

  async update(id: string, data: Partial<ProductionGoal>): Promise<void> {
    try {
      await FirebaseGoalsRepository.update(id, data);
    } catch (error) {
      console.error('[GoalsRepository] Erro ao atualizar meta:', error);
    }
  }
};
