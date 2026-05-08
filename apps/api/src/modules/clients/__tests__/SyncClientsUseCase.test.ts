import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncClientsUseCase } from '../application/use-cases/SyncClientsUseCase.js';
import { ClientsAdapter } from '../infrastructure/integrations/clients.adapter.js';

vi.mock('../infrastructure/integrations/clients.adapter.js', () => ({
  ClientsAdapter: {
    fetchFromExternalAPI: vi.fn()
  }
}));

describe('SyncClientsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch clients and return count', async () => {
    const mockClients = [{ id: 'C1', name: 'Client 1' }, { id: 'C2', name: 'Client 2' }];
    vi.mocked(ClientsAdapter.fetchFromExternalAPI).mockResolvedValue(mockClients);

    const result = await SyncClientsUseCase.execute();

    expect(ClientsAdapter.fetchFromExternalAPI).toHaveBeenCalledWith(1, 5000);
    expect(result.count).toBe(2);
    expect(result.data).toEqual(mockClients);
  });
});
