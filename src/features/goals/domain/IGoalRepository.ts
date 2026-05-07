import { ProductionGoal, GoalPeriod } from './Goal';

export interface IGoalRepository {
  getAll(): Promise<ProductionGoal[]>;
  getById(id: string): Promise<ProductionGoal | null>;
  getByProductCode(code: string, period: GoalPeriod): Promise<ProductionGoal | null>;
  save(goal: ProductionGoal): Promise<void>;
  delete(id: string): Promise<void>;
}
