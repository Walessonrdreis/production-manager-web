import { SectorSync as Sector } from '../../../db/models';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface ISectorRepository extends IRepository<Sector> {
  // Custom methods for Sector can go here
  getByIds?(ids: string[]): Promise<{ success: boolean; data?: Sector[]; error?: string }>;
}
