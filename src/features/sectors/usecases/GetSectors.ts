import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';

/**
 * UseCase: Busca a lista de setores do sistema
 */
export async function getSectors(): Promise<Sector[]> {
  return SectorsRepository.getAll();
}
