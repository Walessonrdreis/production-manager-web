import { Product } from '../../../types/api';
import { PlanningRepository } from '../infra/PlanningRepository';

/**
 * UseCase: Adiciona um item ao planejamento
 */
export async function addPlanningItem(product: Product, quantity: number): Promise<void> {
  await PlanningRepository.add({
    code: String(product.id),
    description: product.description,
    unit: product.unit || 'UN',
    quantity: quantity,
  });
}
