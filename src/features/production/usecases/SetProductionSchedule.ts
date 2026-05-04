import { ScheduleRepository } from '../infra/ScheduleRepository';
import { Result } from '../../../lib/Result';

export async function setProductionSchedule(
  description: string, 
  scheduledAt: string, 
  notes?: string
): Promise<Result<void>> {
  try {
    await ScheduleRepository.save({
      description,
      scheduledAt,
      notes,
      updatedAt: new Date().toISOString()
    });
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao salvar a programação de produção.');
  }
}
