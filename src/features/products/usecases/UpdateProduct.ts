import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';
import { Product } from '../../../types/api';

/**
 * UseCase: Atualiza os detalhes de um produto no catálogo local.
 */
export async function updateProduct(productId: string, data: Partial<Product>): Promise<Result<void>> {
  try {
    await MyProductsRepository.update(productId, data);
    return Result.ok(undefined);
  } catch (err: any) {
    console.error('[UpdateProduct] Failed:', err);
    return Result.fail(err.message || 'Erro ao atualizar produto.');
  }
}
