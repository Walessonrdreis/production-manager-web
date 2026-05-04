import { ScheduleRepository } from '../infra/ScheduleRepository';
import { Result } from '../../../lib/Result';

export async function removeProductionSchedule(description: string): Promise<Result<void>> {
  try {
    await ScheduleRepository.delete(description);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover a programação de produção.');
  }
}
