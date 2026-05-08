import { PlanningItem } from '../../../db/models';
import { IPlanningRepository } from '../domain/IPlanningRepository';
import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'planning';

export const FirebasePlanningRepository: IPlanningRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<PlanningItem>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<PlanningItem>(COLLECTION);
  },
  
  save: async (item: PlanningItem) => {
    return await FirestoreService.save<PlanningItem>(COLLECTION, item);
  },
  
  update: async (id: string, data: Partial<PlanningItem>) => {
    return await FirestoreService.update<PlanningItem>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  },

  getBySector: async (sectorId: string) => {
    return await FirestoreService.list<PlanningItem>(COLLECTION, [where('sectorId', '==', sectorId)]);
  }
};
