import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Solicita sincronização de setores com a API Omie.
 */
export async function syncSectors(): Promise<Result<any>> {
  try {
    const { data } = await SectorsRepository.syncWithOmie();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao sincronizar setores com a Omie.');
  }
}
