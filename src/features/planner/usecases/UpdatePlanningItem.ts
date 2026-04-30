import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';

export async function updatePlanningItem(id: string | number, quantity: number) {
  const validQuantity = PlanningLogic.validateQuantity(quantity);
  return PlanningRepository.update(String(id), { quantity: validQuantity });
}
