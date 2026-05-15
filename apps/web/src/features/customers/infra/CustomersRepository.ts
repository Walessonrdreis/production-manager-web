import { type Customer } from '../../../db/models';
import { Result } from '../../../lib/Result';
import { CustomerSchema, type CustomerInput } from './CustomerSchemas';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export class CustomersRepository {
  static async getAll(params?: { pageSize?: number; page?: number }): Promise<Result<Customer[]>> {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.BASE, { params });
      let data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return Result.ok(data);
      }
      return Result.ok([]);
    } catch (error) {
      console.error('[CustomersRepository] Erro ao buscar da API:', error);
      return Result.fail('Erro ao carregar clientes do banco local');
    }
  }

  static async getById(id: string): Promise<Result<Customer | undefined>> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CUSTOMERS.BASE}/${id}`);
      let data = response.data?.data || response.data;
      if (data) {
        return Result.ok(data);
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail('Erro ao buscar cliente');
    }
  }

  static async save(input: CustomerInput): Promise<Result<Customer>> {
    try {
      const validated = CustomerSchema.parse(input);
      const isEditing = !!validated.id;
      const url = isEditing ? `${ENDPOINTS.CUSTOMERS.BASE}/${validated.id}` : ENDPOINTS.CUSTOMERS.BASE;
      const method = isEditing ? 'put' : 'post';
      
      const payload = {
        ...validated,
        id: validated.id || crypto.randomUUID(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await apiClient[method](url, payload);
      const data = response.data?.data || response.data || payload;

      return Result.ok(data);
    } catch (error) {
      if (error instanceof Error) return Result.fail(error.message);
      return Result.fail('Erro ao salvar cliente');
    }
  }

  static async delete(id: string): Promise<Result<void>> {
    try {
      await apiClient.delete(`${ENDPOINTS.CUSTOMERS.BASE}/${id}`);
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
      if (!res.success && !res.data) {
        return Result.fail('Falha na resposta do proxy ao sincronizar clientes');
      }

      console.log('[CustomersRepository] Sincronização Omie de clientes concluída no backend.');
      return Result.success();
    } catch (error) {
       console.error('[CustomersRepository] Erro no sync Omie:', error);
       return Result.fail('Erro ao sincronizar clientes com Omie');
    }
  }
}

