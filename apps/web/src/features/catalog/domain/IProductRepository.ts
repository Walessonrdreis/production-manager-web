import { SavedProduct } from '../../../db/models';

export interface IProductRepository {
  getAll(): Promise<SavedProduct[]>;
  getById(id: string): Promise<SavedProduct | null>;
  getByCode(code: string): Promise<SavedProduct | null>;
  save(product: SavedProduct): Promise<void>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<SavedProduct[]>;
  updateSectors(productId: string, sectorIds: string[]): Promise<void>;
}
