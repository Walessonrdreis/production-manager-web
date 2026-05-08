import { ProductionRepository } from '../infra/ProductionRepository';
import { TrackingLogic } from '../domain/TrackingLogic';
import { DashboardTotalsResponse } from '../../../types/api';
import { Result } from '../../../lib/Result';

export async function getProductionTotals(): Promise<Result<DashboardTotalsResponse>> {
  try {
    const rawData = await ProductionRepository.getStage20Totals();
    const aggregatedData = TrackingLogic.aggregateStage20Totals(rawData);
    return Result.ok(aggregatedData);
  } catch (err) {
    return Result.fail('Erro ao buscar totais de produção.');
  }
}
