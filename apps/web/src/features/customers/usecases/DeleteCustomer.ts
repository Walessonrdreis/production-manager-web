import { CustomersRepository } from '../infra/CustomersRepository';
import { type Result } from '../../../lib/Result';

export async function deleteCustomer(id: string): Promise<Result<void>> {
  return CustomersRepository.delete(id);
}
