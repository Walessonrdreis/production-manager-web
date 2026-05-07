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
      let page = 1;
      let hasMore = true;
      let expectedTotal: number | null = null;
      let allProcessed = 0;

      while (hasMore) {
        const response = await apiClient.get(ENDPOINTS.CUSTOMERS.BASE, { 
          params: { page, pageSize: 100 } 
        });
        const res = response.data;
        
        if (expectedTotal === null && res.total) {
          expectedTotal = res.total;
        }
        
        const pageData = res.data || [];
        if (!Array.isArray(pageData) || pageData.length === 0) {
          hasMore = false;
          break;
        }

        const validCustomers: Customer[] = pageData.map(c => ({
          id: c.omieClientCode || crypto.randomUUID(),
          name: c.tradeName || c.legalName || 'Sem Nome',
          document: c.document || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          omieCode: c.omieClientCode || undefined,
          updatedAt: new Date().toISOString()
        }));

        for (const c of validCustomers) {
          await FirebaseCustomerRepository.save(c);
        }

        allProcessed += validCustomers.length;

        if (expectedTotal !== null && allProcessed >= expectedTotal) {
          hasMore = false;
        } else {
          page++;
        }

        // Safety break
        if (page > 50) hasMore = false;
      }

      // Optional backend trigger
      try {
        await apiClient.post(ENDPOINTS.CUSTOMERS.SYNC, {});
      } catch(e) {
        // Just ignore if it fails
      }

      return Result.success();
    } catch (error) {
       console.error('[CustomersRepository] Erro no sync Omie', error);
       return Result.fail('Erro ao sincronizar clientes com Omie');
    }
  }
}

