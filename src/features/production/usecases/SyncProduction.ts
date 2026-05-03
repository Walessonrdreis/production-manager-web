import { ProductionRepository } from '../infra/ProductionRepository';
import { Result } from '../../../lib/Result';

export async function syncProduction(): Promise<Result<{ message: string; count: number }>> {
  try {
    const data = await ProductionRepository.syncStage20();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao sincronizar produção.');
  }
}
