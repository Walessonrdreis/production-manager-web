import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

export async function deleteSector(id: string): Promise<Result<void>> {
  try {
    await SectorsRepository.delete(id);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao excluir setor.');
  }
}
