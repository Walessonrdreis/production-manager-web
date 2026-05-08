import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncOrdersUseCase } from '../application/use-cases/SyncOrdersUseCase.js';
import { OrdersAdapter } from '../infrastructure/integrations/orders.adapter.js';

vi.mock('../infrastructure/integrations/orders.adapter.js', () => ({
  OrdersAdapter: {
    fetchFromExternalAPI: vi.fn()
  }
}));

describe('SyncOrdersUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch, map, and return orders', async () => {
    const rawApiRes = [
      { order: { omieCode: '001', orderNumber: '100' }, client: { tradeName: 'Client A' } }
    ];
    vi.mocked(OrdersAdapter.fetchFromExternalAPI).mockResolvedValue(rawApiRes);

    const result = await SyncOrdersUseCase.execute();

    expect(OrdersAdapter.fetchFromExternalAPI).toHaveBeenCalledWith(1, 500);
    expect(result.count).toBe(1);
    expect(result.data[0].id).toBe('001');
    expect(result.data[0].customer_name).toBe('Client A');
  });
});
