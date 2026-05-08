import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';

export class GetClientsListUseCase {
  static async execute(params?: any) {
    const data = await ClientsAdapter.fetchClientsList(params);
    return { data };
  }
}
