import { Customer } from '../../../db/models';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface ICustomerRepository extends IRepository<Customer> {
  getByEmail?(email: string): Promise<{ success: boolean; data?: Customer; error?: string }>;
}
