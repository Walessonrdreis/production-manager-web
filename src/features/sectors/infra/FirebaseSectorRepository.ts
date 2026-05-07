import { SectorSync as Sector } from '../../../db/models';
import { ISectorRepository } from '../domain/ISectorRepository';
import { FirestoreService } from '../../../services/FirestoreService';

const COLLECTION = 'sectors';

export const FirebaseSectorRepository: ISectorRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<Sector>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<Sector>(COLLECTION);
  },
  
  save: async (sector: Sector) => {
    return await FirestoreService.save<Sector>(COLLECTION, sector);
  },
  
  update: async (id: string, data: Partial<Sector>) => {
    return await FirestoreService.update<Sector>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  }
};
