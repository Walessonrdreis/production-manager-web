import { PlanningRepository } from '../infra/PlanningRepository';
import { type PlanningItem } from '../../../db/models';

/**
 * UseCase: Adiciona múltiplos itens ao planejamento (formato bruto)
 */
export async function addBulkPlanningItemsRaw(items: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[]) {
  return PlanningRepository.bulkAdd(items);
}
