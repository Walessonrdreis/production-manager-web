import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';

export class SyncClientsUseCase {
  static async execute(page: number = 1, pageSize: number = 5000) {
    const clients = await ClientsAdapter.fetchFromExternalAPI(page, pageSize);
    return { count: clients.length, data: clients };
  }
}
