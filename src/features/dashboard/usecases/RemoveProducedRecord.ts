import { DashboardRepository } from '../infra/DashboardRepository';

export async function removeProducedRecord(id: string): Promise<any> {
  return DashboardRepository.removeProduced(id);
}
