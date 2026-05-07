import { useLiveQuery } from 'dexie-react-hooks';
import { goalsDb } from '../../features/goals/infra/GoalsDB';
import { GoalsRepository } from '../../features/goals/infra/GoalsRepository';
import { ProductionGoal } from '../../features/goals/domain/Goal';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

export function useGoals() {
  const goals = useLiveQuery(() => goalsDb.goals.toArray()) || [];

  // Sincronização básica inicial
  useEffect(() => {
    const sync = async () => {
      try {
        await GoalsRepository.getAll();
      } catch (e) {
        console.warn('Falha no sync inicial de metas:', e);
      }
    };
    sync();
  }, []);

  const saveGoal = async (goalData: Omit<ProductionGoal, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>) => {
    const newGoal: ProductionGoal = {
      ...goalData,
      id: uuidv4(),
      synced: false,
      lastModified: Date.now(),
      version: 1,
      updatedAt: new Date().toISOString()
    };
    await GoalsRepository.save(newGoal);
  };

  const updateGoal = async (id: string, updates: Partial<ProductionGoal>) => {
    await GoalsRepository.update(id, updates);
  };

  const deleteGoal = async (id: string) => {
    await GoalsRepository.delete(id);
  };

  return {
    goals,
    saveGoal,
    updateGoal,
    deleteGoal
  };
}
