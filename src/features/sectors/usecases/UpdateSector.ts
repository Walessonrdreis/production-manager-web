import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

export async function updateSector(id: string, sector: Partial<Sector>): Promise<Result<void>> {
  try {
    await SectorsRepository.update(id, sector);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao atualizar setor.');
  }
}
