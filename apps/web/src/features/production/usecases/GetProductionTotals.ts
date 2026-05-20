import { ProductionRepository } from '../infra/ProductionRepository';
import { TrackingLogic } from '../domain/TrackingLogic';
import { DashboardTotalsResponse } from '../../../types/api';
import { Result } from '../../../lib/Result';

export async function getProductionTotals(): Promise<Result<DashboardTotalsResponse>> {
  try {
    const rawData = await ProductionRepository.getStage20Totals();
    // A API agora retorna os dados já agregados no formato correto
    return Result.ok({
      data: rawData.data || [],
      totalItems: rawData.totalItems || 0,
      lastUpdate: new Date().toISOString()
    });
  } catch (err) {
    return Result.fail('Erro ao buscar totais de produção.');
  }
}
