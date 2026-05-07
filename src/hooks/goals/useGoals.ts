import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GoalsRepository } from '../../features/goals/infra/GoalsRepository';
import { ProductionGoal } from '../../features/goals/domain/Goal';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useCallback } from 'react';

export function useGoals() {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => GoalsRepository.getAll()
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['goals'] });
  }, [queryClient]);

  const saveGoal = async (goalData: Omit<ProductionGoal, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>) => {
    const newGoal: ProductionGoal = {
      ...goalData,
      id: uuidv4(),
      synced: true,
      lastModified: Date.now(),
      version: 1,
      updatedAt: new Date().toISOString()
    };
    await GoalsRepository.save(newGoal);
    invalidate();
  };

  const updateGoal = async (id: string, updates: Partial<ProductionGoal>) => {
    await GoalsRepository.update(id, updates);
    invalidate();
  };

  const deleteGoal = async (id: string) => {
    await GoalsRepository.delete(id);
    invalidate();
  };

  return {
    goals,
    isLoading,
    saveGoal,
    updateGoal,
    deleteGoal
  };
}
