import { CustomersRepository } from '../infra/CustomersRepository';
import { type CustomerInput } from '../infra/CustomerSchemas';
import { type Result } from '../../../lib/Result';
import { type Customer } from '../../../db/models';

export async function saveCustomer(input: CustomerInput): Promise<Result<Customer>> {
  return CustomersRepository.save(input);
}
