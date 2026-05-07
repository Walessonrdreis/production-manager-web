import { ProductionGoal } from '../domain/Goal';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface IGoalsRepository extends IRepository<ProductionGoal> {
  getByProductAndPeriod?(productCode: string, period: string): Promise<{ success: boolean; data?: ProductionGoal[]; error?: string }>;
}
