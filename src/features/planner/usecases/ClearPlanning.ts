import { PlanningRepository } from '../infra/PlanningRepository';

export async function clearPlanning() {
  return PlanningRepository.clear();
}
