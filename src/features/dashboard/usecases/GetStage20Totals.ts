import { DashboardRepository } from '../infra/DashboardRepository';
import { DashboardTotalsResponse } from '../../../types/api';

export async function getStage20Totals(): Promise<DashboardTotalsResponse> {
  return DashboardRepository.getStage20Totals();
}
