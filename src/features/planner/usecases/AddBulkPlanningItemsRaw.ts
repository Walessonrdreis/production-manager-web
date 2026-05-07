import { PlanningRepository } from '../infra/PlanningRepository';
import { type PlanningItem } from '../../../db/models';

/**
 * UseCase: Adiciona múltiplos itens ao planejamento (formato bruto)
 */
export async function addBulkPlanningItemsRaw(items: Omit<PlanningItem, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>[]) {
  return PlanningRepository.bulkAdd(items);
}
