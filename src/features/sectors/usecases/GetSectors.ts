import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Busca a lista de setores do sistema.
 */
export async function getSectors(): Promise<Result<Sector[]>> {
  try {
    const sectors = await SectorsRepository.getAll({ includeInactive: true });
    return Result.ok(sectors);
  } catch (err: any) {
    console.error('[UseCase] Erro ao buscar setores:', err);
    return Result.fail(err.message || 'Erro ao buscar setores.');
  }
}
