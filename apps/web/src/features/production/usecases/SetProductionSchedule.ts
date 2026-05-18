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
    const schedules = await ScheduleRepository.getAll();
    const existing = schedules.find(s => s.description === description);
    const id = existing?.id || uuidv4();

    await ScheduleRepository.save({
      id,
      productCode: productCode || existing?.productCode || '',
      description,
      scheduledAt,
      quantity: quantity || existing?.quantity,
      sectorId: sectorId || existing?.sectorId,
      sectorName: sectorName || existing?.sectorName,
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

