import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';
import { legacyPrisma } from '../../../../infra/prisma.js';

export class SyncClientsUseCase {
  static async execute(page: number = 1, pageSize: number = 5000) {
    const clients = await ClientsAdapter.fetchFromExternalAPI(page, pageSize);
    
    // Save to Prisma
    try {
      const validClientIds = new Set<string>();

      // Upsert fetched clients
      for (const client of clients) {
        const clientId = client.omieCode || client.codigo_cliente_omie;
        if (!clientId) continue;
        validClientIds.add(String(clientId));
        
        await legacyPrisma.customer.upsert({
          where: { id: String(clientId) },
          create: { id: String(clientId), data: JSON.stringify(client) },
          update: { data: JSON.stringify(client) }
        });
      }
      console.log(`[SYNC CLIENTS] Successfully saved ${clients.length} clients to Prisma.`);

      // Delete obsolete clients
      if (validClientIds.size > 0) {
        const allClients = await legacyPrisma.customer.findMany({ select: { id: true } });
        const docsToDelete = allClients.filter(c => !validClientIds.has(c.id)).map(c => c.id);

        if (docsToDelete.length > 0) {
          await legacyPrisma.customer.deleteMany({
            where: { id: { in: docsToDelete } }
          });
          console.log(`[SYNC CLIENTS] Successfully deleted ${docsToDelete.length} obsolete clients from Prisma.`);
        }
      }
    } catch (err: any) {
      console.error('[SYNC CLIENTS] Error saving to Prisma:', err.message);
    }
    
    return { count: clients.length, data: clients };
  }
}


