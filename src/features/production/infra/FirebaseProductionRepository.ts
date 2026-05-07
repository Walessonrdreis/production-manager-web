import { ProducedRecord } from '../../../db/models';
import { IProductionRepository } from '../domain/IProductionRepository';
import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'produced';

export const FirebaseProductionRepository: IProductionRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<ProducedRecord>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<ProducedRecord>(COLLECTION);
  },
  
  save: async (item: ProducedRecord) => {
    return await FirestoreService.save<ProducedRecord>(COLLECTION, item);
  },
  
  update: async (id: string, data: Partial<ProducedRecord>) => {
    return await FirestoreService.update<ProducedRecord>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  },

  getByOrder: async (orderId: string) => {
    return await FirestoreService.list<ProducedRecord>(COLLECTION, [where('orderId', '==', orderId)]);
  }
};
