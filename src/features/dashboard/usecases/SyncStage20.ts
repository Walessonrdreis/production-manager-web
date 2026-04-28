import { DashboardRepository } from '../infra/DashboardRepository';

export async function syncStage20(): Promise<{ message: string; count: number }> {
  return DashboardRepository.syncStage20();
}
