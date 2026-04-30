import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Busca a lista de setores do sistema.
 */
export async function getSectors(): Promise<Result<Sector[]>> {
  try {
    const sectors = await SectorsRepository.getAll();
    return Result.ok(sectors);
  } catch (err) {
    return Result.fail('Erro ao buscar setores.');
  }
}
