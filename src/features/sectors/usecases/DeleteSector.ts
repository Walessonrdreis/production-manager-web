import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

export async function deleteSector(id: string): Promise<Result<void>> {
  try {
    await SectorsRepository.delete(id);
    return Result.ok(undefined);
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Erro ao excluir setor.';
    console.error('[DeleteSector Usecase] Failed:', message);
    return Result.fail(message);
  }
}
