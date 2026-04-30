import { Product } from '../../../types/api';
import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';

/**
 * UseCase: Adiciona múltiplos produtos ao planejamento com quantidade padrão 1
 */
export async function addBulkPlanningItems(products: Product[]): Promise<void> {
  const currentItems = await PlanningRepository.getAll();
  const productsWithQuantity = products.map(p => ({ product: p, quantity: 1 }));

  const { toAdd, toUpdate } = PlanningLogic.calculateAdditions(currentItems, productsWithQuantity);

  if (toAdd.length > 0) {
    await PlanningRepository.bulkAdd(toAdd);
  }

  if (toUpdate.length > 0) {
    await PlanningRepository.bulkUpdate(toUpdate);
  }
}
