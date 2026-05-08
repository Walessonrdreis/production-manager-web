import { type Customer } from '../../../db/models';
import { Result } from '../../../lib/Result';
import { CustomerSchema, type CustomerInput } from './CustomerSchemas';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { FirebaseCustomerRepository } from './FirebaseCustomerRepository';

export class CustomersRepository {
  static async getAll(params?: { pageSize?: number; page?: number }): Promise<Result<Customer[]>> {
    try {
      const response = await FirebaseCustomerRepository.getAll();
      if (response.success && response.data) {
         return Result.ok(response.data);
      }
      return Result.ok([]);
    } catch (error) {
      console.error('[CustomersRepository] Erro ao buscar da API, faling back para local:', error);
      return Result.fail('Erro ao carregar clientes do banco local');
    }
  }

  static async getById(id: string): Promise<Result<Customer | undefined>> {
    try {
      const response = await FirebaseCustomerRepository.getById(id);
      if (response.success && response.data) {
        return Result.ok(response.data);
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail('Erro ao buscar cliente');
    }
  }

  static async save(input: CustomerInput): Promise<Result<Customer>> {
    try {
      const validated = CustomerSchema.parse(input);
      const customer: Customer = {
        ...validated,
        id: validated.id || crypto.randomUUID(),
        updatedAt: new Date().toISOString()
      };

      await FirebaseCustomerRepository.save(customer);
      return Result.ok(customer);
    } catch (error) {
      if (error instanceof Error) return Result.fail(error.message);
      return Result.fail('Erro ao salvar cliente');
    }
  }

  static async delete(id: string): Promise<Result<void>> {
    try {
      await FirebaseCustomerRepository.delete(id);
      return Result.success();
    } catch (error) {
      return Result.fail('Erro ao excluir cliente');
    }
  }

  static async syncWithOmie(): Promise<Result<void>> {
    try {
      console.log('[CustomersRepository] Iniciando sincronização Omie de clientes...');
      const response = await apiClient.post(ENDPOINTS.CUSTOMERS.SYNC, {}, { timeout: 120000 });
      
      const res = response.data;
      if (!res.success || !res.data) {
        return Result.fail('Falha na resposta do proxy ao sincronizar clientes');
      }

      const pageData = res.data || [];
      if (!Array.isArray(pageData) || pageData.length === 0) {
        console.log('[CustomersRepository] Nenhum cliente retornado do Omie.');
        return Result.success();
      }

      const validCustomers: Customer[] = pageData.map((c: any) => ({
        id: c.omieClientCode || c.id || crypto.randomUUID(),
        name: c.tradeName || c.legalName || c.name || 'Sem Nome',
        document: c.document || undefined,
        email: c.email || undefined,
        phone: c.phone || undefined,
        omieCode: c.omieClientCode || c.omieCode || undefined,
        updatedAt: new Date().toISOString()
      }));

      console.log(`[CustomersRepository] Processando ${validCustomers.length} clientes...`);

      // Salva no firebase sequencialmente em background em lotes
      await (FirebaseCustomerRepository as any).saveMany(validCustomers);

      console.log('[CustomersRepository] Sincronização Omie de clientes concluída.');
      return Result.success();
    } catch (error) {
       console.error('[CustomersRepository] Erro no sync Omie:', error);
       return Result.fail('Erro ao sincronizar clientes com Omie');
    }
  }
}

