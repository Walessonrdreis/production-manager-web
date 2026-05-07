import { ProductionGoal, GoalPeriod } from '../domain/Goal';
import { IGoalRepository } from '../domain/IGoalRepository';
import { goalsDb } from './GoalsDB';

export class GoalIndexedDBRepo implements IGoalRepository {
  async getAll(): Promise<ProductionGoal[]> {
    return await goalsDb.goals.toArray();
  }

  async getById(id: string): Promise<ProductionGoal | null> {
    return await goalsDb.goals.get(id) || null;
  }

  async getByProductCode(code: string, period: GoalPeriod): Promise<ProductionGoal | null> {
    return await goalsDb.goals
      .where({ productCode: code, period })
      .first() || null;
  }

  async save(goal: ProductionGoal): Promise<void> {
    await goalsDb.goals.put({
      ...goal,
      lastModified: goal.lastModified || Date.now(),
      synced: goal.synced !== undefined ? goal.synced : false
    });
  }

  async delete(id: string): Promise<void> {
    await goalsDb.goals.delete(id);
  }
}

export const goalRepository = new GoalIndexedDBRepo();
