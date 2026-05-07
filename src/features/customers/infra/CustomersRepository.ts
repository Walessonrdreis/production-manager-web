import { db } from '../../../db';
import { type Customer } from '../../../db/models';
import { Result } from '../../../lib/Result';
import { CustomerSchema, type CustomerInput } from './CustomerSchemas';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export class CustomersRepository {
  static async getAll(params?: { pageSize?: number; page?: number }): Promise<Result<Customer[]>> {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.BASE, { params });
      const apiData = response.data;
      
      let customersList: any[] = [];
      if (apiData && Array.isArray(apiData.data)) {
        customersList = apiData.data;
      } else if (Array.isArray(apiData)) {
        customersList = apiData;
      }

      // Convert API payload to local standard
      const validCustomers: Customer[] = customersList.map(c => ({
        id: c.omieClientCode || crypto.randomUUID(),
        name: c.tradeName || c.legalName || 'Sem Nome',
        document: c.document || undefined,
        email: c.email || undefined,
        phone: c.phone || undefined,
        omieCode: c.omieClientCode || undefined,
        updatedAt: new Date().toISOString()
      }));

      // Cache locally
      await db.transaction('rw', db.customers, async () => {
        const apiIds = new Set(validCustomers.map(c => c.id));
        const localCustomers = await db.customers.toArray();
        const now = new Date().toISOString();

        // Delete locals not in API (soft sync)
        for (const local of localCustomers) {
           if (local.omieCode && !apiIds.has(local.omieCode)) {
             // In a true sync, we wouldn't delete them if they are paginated
             // but if we do a full sync maybe we can. For now let's just insert/update
           }
        }

        // Insert / Update
        for (const c of validCustomers) {
           const existing = await db.customers.get(c.id);
           await db.customers.put({
             ...existing,
             ...c,
             updatedAt: existing?.updatedAt || c.updatedAt
           });
        }
      });

      return Result.ok(validCustomers);
    } catch (error) {
      console.error('[CustomersRepository] Erro ao buscar da API, faling back para local:', error);
      try {
        const customers = await db.customers.toArray();
        return Result.ok(customers);
      } catch (err) {
        return Result.fail('Erro ao carregar clientes do banco local');
      }
    }
  }

  static async getById(id: string): Promise<Result<Customer | undefined>> {
    try {
      // First try to fetch from API
      try {
        const response = await apiClient.get(`${ENDPOINTS.CUSTOMERS.BASE}/${id}`);
        const c = response.data;
        if (c && c.omieClientCode) {
          const customer: Customer = {
            id: c.omieClientCode,
            name: c.tradeName || c.legalName || 'Sem Nome',
            document: c.document || undefined,
            email: c.email || undefined,
            phone: c.phone || undefined,
            omieCode: c.omieClientCode || undefined,
            updatedAt: new Date().toISOString()
          };
          await db.customers.put(customer);
          return Result.ok(customer);
        }
      } catch (e) {
        console.warn(`[CustomersRepository] Could not fetch customer ${id} from API, using local.`);
      }

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

      // Na arquitetura de read-only clientes via OMIE, talvez não possamos salvar.
      // Se pudermos, faríamos um POST aqui.
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

        await db.transaction('rw', db.customers, async () => {
          for (const c of validCustomers) {
            const existing = await db.customers.get(c.id);
            await db.customers.put({
              ...existing,
              ...c,
              updatedAt: existing?.updatedAt || c.updatedAt
            });
          }
        });

        allProcessed += validCustomers.length;

        if (expectedTotal !== null && allProcessed >= expectedTotal) {
          hasMore = false;
        } else {
          page++;
        }

        // Safety break
        if (page > 500) hasMore = false;
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

