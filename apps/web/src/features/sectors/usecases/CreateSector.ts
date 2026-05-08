import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

export async function createSector(sector: Omit<Sector, 'id'>): Promise<Result<void>> {
  try {
    await SectorsRepository.create(sector);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao criar setor.');
  }
}
