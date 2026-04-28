import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';

export async function updateSector(id: string, sector: Partial<Sector>) {
  return SectorsRepository.update(id, sector);
}
