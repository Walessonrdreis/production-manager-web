import { Customer } from '../../../db/models';
import { ICustomerRepository } from '../domain/ICustomerRepository';
import { FirestoreService } from '../../../services/FirestoreService';
import { where } from 'firebase/firestore';

const COLLECTION = 'customers';

export const FirebaseCustomerRepository: ICustomerRepository = {
  getById: async (id: string) => {
    return await FirestoreService.getOne<Customer>(COLLECTION, id);
  },
  
  getAll: async () => {
    return await FirestoreService.list<Customer>(COLLECTION);
  },
  
  save: async (item: Customer) => {
    return await FirestoreService.save<Customer>(COLLECTION, item);
  },
  
  update: async (id: string, data: Partial<Customer>) => {
    return await FirestoreService.update<Customer>(COLLECTION, id, data);
  },
  
  delete: async (id: string) => {
    return await FirestoreService.delete(COLLECTION, id);
  },

  getByEmail: async (email: string) => {
    const response = await FirestoreService.list<Customer>(COLLECTION, [where('email', '==', email)]);
    if (response.success && response.data && response.data.length > 0) {
      return { success: true, data: response.data[0] };
    }
    return { success: false, error: 'Customer not found' };
  }
};
