import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncProductsUseCase } from '../application/use-cases/SyncProductsUseCase.js';
import { ProductsAdapter } from '../infrastructure/integrations/products.adapter.js';

vi.mock('../infrastructure/integrations/products.adapter.js', () => ({
  ProductsAdapter: {
    fetchFromExternalAPI: vi.fn()
  }
}));

describe('SyncProductsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch products and return count', async () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
    vi.mocked(ProductsAdapter.fetchFromExternalAPI).mockResolvedValue(mockProducts);

    const result = await SyncProductsUseCase.execute();

    expect(ProductsAdapter.fetchFromExternalAPI).toHaveBeenCalledWith(1000);
    expect(result.count).toBe(2);
    expect(result.data).toEqual(mockProducts);
  });
});
