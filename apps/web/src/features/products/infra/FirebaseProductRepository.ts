import { SavedProduct as Product } from '../../../db/models';
import { IProductRepository } from '../domain/IProductRepository';
import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'products';

export const FirebaseProductRepository: IProductRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<Product>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<Product>(COLLECTION);
  },
  
  save: async (product: Product) => {
    return await FirestoreService.save<Product>(COLLECTION, product);
  },
  
  saveMany: async (products: Product[]) => {
    return await FirestoreService.saveMany<Product>(COLLECTION, products);
  },
  
  update: async (id: string, data: Partial<Product>) => {
    return await FirestoreService.update<Product>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  },

  getBySector: async (sectorId: string) => {
    return await FirestoreService.list<Product>(COLLECTION, [where('sectorIds', 'array-contains', sectorId)]);
  }
};
