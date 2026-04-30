import { db } from '../../../db';
import { type Customer } from '../../../db/models';
import { Result } from '../../../lib/Result';
import { CustomerSchema, type CustomerInput } from './CustomerSchemas';

export class CustomersRepository {
  static async getAll(): Promise<Result<Customer[]>> {
    try {
      const customers = await db.customers.toArray();
      return Result.ok(customers);
    } catch (error) {
      return Result.fail('Erro ao carregar clientes do banco local');
    }
  }

  static async getById(id: string): Promise<Result<Customer | undefined>> {
    try {
      const customer = await db.customers.get(id);
      return Result.ok(customer);
    } catch (error) {
      return Result.fail('Erro ao buscar cliente');
    }
  }

  static async save(input: CustomerInput): Promise<Result<Customer>> {
    try {
      const validated = CustomerSchema.parse(input);
      const customer: Customer = {
        ...validated,
        updatedAt: new Date().toISOString()
      };

      await db.customers.put(customer);
      return Result.ok(customer);
    } catch (error) {
      if (error instanceof Error) return Result.fail(error.message);
      return Result.fail('Erro ao salvar cliente');
    }
  }

  static async delete(id: string): Promise<Result<void>> {
    try {
      await db.customers.delete(id);
      return Result.success();
    } catch (error) {
      return Result.fail('Erro ao excluir cliente');
    }
  }
}
