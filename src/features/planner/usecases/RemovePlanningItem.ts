import { PlanningRepository } from '../infra/PlanningRepository';

export async function removePlanningItem(id: string | number) {
  return PlanningRepository.delete(String(id));
}
