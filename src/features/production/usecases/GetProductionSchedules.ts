import { ScheduleRepository } from '../infra/ScheduleRepository';
import { ProductionSchedule } from '../../../db/models';
import { Result } from '../../../lib/Result';

export async function getProductionSchedules(): Promise<Result<ProductionSchedule[]>> {
  try {
    const data = await ScheduleRepository.getAll();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao buscar as datas de produção programadas.');
  }
}
