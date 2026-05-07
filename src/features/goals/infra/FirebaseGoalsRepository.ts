import { ProductionGoal } from '../domain/Goal';
import { IGoalsRepository } from '../domain/IGoalsRepository';
import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'goals';

export const FirebaseGoalsRepository: IGoalsRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<ProductionGoal>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<ProductionGoal>(COLLECTION);
  },
  
  save: async (item: ProductionGoal) => {
    return await FirestoreService.save<ProductionGoal>(COLLECTION, item);
  },
  
  update: async (id: string, data: Partial<ProductionGoal>) => {
    return await FirestoreService.update<ProductionGoal>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  },

  getByProductAndPeriod: async (productCode: string, period: string) => {
    return await FirestoreService.list<ProductionGoal>(COLLECTION, [
      where('productCode', '==', productCode),
      where('period', '==', period)
    ]);
  }
};
