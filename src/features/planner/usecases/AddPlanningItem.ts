import { Product } from '../../../types/api';
import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';

/**
 * UseCase: Adiciona um item ao planejamento
 */
export async function addPlanningItem(product: Product, quantity: number): Promise<void> {
  const currentItems = await PlanningRepository.getAll();
  const validQuantity = PlanningLogic.validateQuantity(quantity);
  
  const { toAdd, toUpdate } = PlanningLogic.calculateAdditions(currentItems, [
    { product, quantity: validQuantity }
  ]);

  if (toAdd.length > 0) {
    await PlanningRepository.add(toAdd[0]);
  }

  if (toUpdate.length > 0) {
    await PlanningRepository.update(toUpdate[0].id, { quantity: toUpdate[0].quantity });
  }
}
