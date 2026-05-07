import { PlanningItem } from '../../../db/models';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface IPlanningRepository extends IRepository<PlanningItem> {
  getBySector?(sectorId: string): Promise<{ success: boolean; data?: PlanningItem[]; error?: string }>;
}
