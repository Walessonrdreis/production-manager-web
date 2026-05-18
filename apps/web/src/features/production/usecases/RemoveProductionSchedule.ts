import { ScheduleRepository } from '../infra/ScheduleRepository';
import { Result } from '../../../lib/Result';

export async function removeProductionSchedule(description: string): Promise<Result<void>> {
  try {
    const schedules = await ScheduleRepository.getAll();
    const schedule = schedules.find(s => s.description === description);
    
    if (schedule && schedule.id) {
      await ScheduleRepository.delete(schedule.id);
    }
    
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover a programação de produção.');
  }
}
