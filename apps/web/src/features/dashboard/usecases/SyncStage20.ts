import { DashboardRepository } from '../infra/DashboardRepository';
import { Result } from '../../../lib/Result';

export async function syncStage20(): Promise<Result<{ message: string; count: number }>> {
  try {
    const data = await DashboardRepository.syncStage20();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao sincronizar Etapa 20.');
  }
}
