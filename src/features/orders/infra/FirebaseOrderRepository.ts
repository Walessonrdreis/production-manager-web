import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'orders';

export const FirebaseOrderRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<any>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<any>(COLLECTION);
  },
  
  save: async (order: any) => {
    return await FirestoreService.save<any>(COLLECTION, order);
  },
  
  saveMany: async (orders: any[]) => {
    return await FirestoreService.saveMany<any>(COLLECTION, orders);
  },
  
  update: async (id: string, data: Partial<any>) => {
    return await FirestoreService.update<any>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  }
};
