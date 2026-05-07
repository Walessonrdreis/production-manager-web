import { SavedProduct as Product } from '../../../db/models';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface IProductRepository extends IRepository<Product> {
  // Products have specific custom methods
  getBySector?(sectorId: string): Promise<{ success: boolean; data?: Product[]; error?: string }>;
}
