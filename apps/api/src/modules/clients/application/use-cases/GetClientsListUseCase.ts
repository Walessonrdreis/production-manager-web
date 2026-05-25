import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';
import { legacyPrisma } from '../../../../infra/prisma.js';

export class GetClientsListUseCase {
  static async execute(params?: any) {
    try {
      // Tentar fetch da API externa, se falhar ou retornar 404 engole o erro
      // O frontend não pode quebrar por causa disso
      const externalData = await ClientsAdapter.fetchClientsList(params).catch(() => null);
      if (externalData && Array.isArray(externalData) && externalData.length > 0) {
        return { data: externalData };
      }

      // Se falhou ou vazia, buscar do banco legado local
      const dbClients = await legacyPrisma.customer.findMany().catch(() => []);
      
      const mapped = dbClients.map(c => {
        try {
          return typeof c.data === 'string' ? JSON.parse(c.data) : c.data;
        } catch {
          return c;
        }
      });
      
      return { data: mapped };
    } catch (err: any) {
      console.error('[GetClientsListUseCase] Erro:', err);
      // Retorna vazio em vez de 404 para não quebrar a UI
      return { data: [] };
    }
  }
}
