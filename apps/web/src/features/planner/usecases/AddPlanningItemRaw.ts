import { PlanningRepository } from '../infra/PlanningRepository';
import { type PlanningItem } from '../../../db/models';

/**
 * UseCase: Adiciona um item ao planejamento (formato bruto)
 */
export async function addPlanningItemRaw(item: Omit<PlanningItem, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>) {
  return PlanningRepository.add(item);
}
