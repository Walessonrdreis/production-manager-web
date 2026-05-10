import { Collaborator } from '../../../types/api';
import { FirestoreService } from '../../../services/FirestoreService';

const COLLECTION = 'collaborators';

export const FirebaseCollaboratorsRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<Collaborator>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<Collaborator>(COLLECTION);
  },
  
  save: async (collaborator: Collaborator) => {
    return await FirestoreService.save<Collaborator>(COLLECTION, collaborator);
  },
  
  saveMany: async (collaborators: Collaborator[]) => {
    return await FirestoreService.saveMany<Collaborator>(COLLECTION, collaborators);
  },
  
  update: async (id: string, data: Partial<Collaborator>) => {
    return await FirestoreService.update<Collaborator>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  }
};
