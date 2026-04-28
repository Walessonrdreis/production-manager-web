import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';

export async function createSector(sector: Omit<Sector, 'id'>) {
  return SectorsRepository.create(sector);
}
