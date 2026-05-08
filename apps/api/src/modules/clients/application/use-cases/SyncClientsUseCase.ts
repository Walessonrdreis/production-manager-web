import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';

export class SyncClientsUseCase {
  static async execute() {
    const clients = await ClientsAdapter.fetchFromExternalAPI(1, 5000);
    return { count: clients.length, data: clients };
  }
}
