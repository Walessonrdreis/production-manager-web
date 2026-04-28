import { DashboardRepository } from '../infra/DashboardRepository';

export async function getProducedRecords(): Promise<any[]> {
  return DashboardRepository.getProduced();
}
