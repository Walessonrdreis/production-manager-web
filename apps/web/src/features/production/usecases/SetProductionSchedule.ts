import { ScheduleRepository } from '../infra/ScheduleRepository';
import { Result } from '../../../lib/Result';
import { v4 as uuidv4 } from 'uuid';

export async function setProductionSchedule(
  description: string, 
  scheduledAt: string, 
  notes?: string,
  productCode?: string,
  quantity?: number,
  sectorId?: string,
  sectorName?: string
): Promise<Result<void>> {
  try {
    await ScheduleRepository.save({
      id: uuidv4(),
      productCode: productCode || '',
      description,
      scheduledAt,
      quantity,
      sectorId,
      sectorName,
      notes,
      synced: false,
      lastModified: Date.now(),
      version: 1,
      updatedAt: new Date().toISOString()
    });
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao salvar a programação de produção.');
  }
}
