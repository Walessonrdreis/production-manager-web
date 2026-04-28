import { PlanningRepository } from '../infra/PlanningRepository';

export async function updatePlanningItem(id: string | number, quantity: number) {
  return PlanningRepository.update(String(id), { quantity: Math.max(1, quantity) });
}
