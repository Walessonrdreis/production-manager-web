import { DashboardRepository } from '../infra/DashboardRepository';
import { DashboardTotalsResponse } from '../../../types/api';
import { Result } from '../../../lib/Result';

export async function getStage20Totals(): Promise<Result<DashboardTotalsResponse>> {
  try {
    const data = await DashboardRepository.getStage20Totals();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao buscar totais da Etapa 20.');
  }
}
