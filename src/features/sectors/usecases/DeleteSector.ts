import { SectorsRepository } from '../infra/SectorsRepository';

export async function deleteSector(id: string) {
  return SectorsRepository.delete(id);
}
