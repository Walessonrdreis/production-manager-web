import { DashboardRepository } from '../infra/DashboardRepository';

export async function addProducedRecord(description: string, quantity: number): Promise<any> {
  return DashboardRepository.addProduced(description, quantity);
}
