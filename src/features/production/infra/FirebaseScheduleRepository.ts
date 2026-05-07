import { ProductionSchedule } from '../../../db/models';
import { FirestoreService } from '../../../services/FirestoreService';

const COLLECTION = 'schedules';

export const FirebaseScheduleRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<ProductionSchedule>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<ProductionSchedule>(COLLECTION);
  },
  
  save: async (item: ProductionSchedule) => {
    return await FirestoreService.save<ProductionSchedule>(COLLECTION, item);
  },
  
  update: async (id: string, data: Partial<ProductionSchedule>) => {
    return await FirestoreService.update<ProductionSchedule>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  }
};
