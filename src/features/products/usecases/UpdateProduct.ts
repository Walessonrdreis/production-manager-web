import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';
import { Product } from '../../../types/api';

/**
 * UseCase: Atualiza os detalhes de um produto no catálogo local.
 */
export async function updateProduct(productId: string, data: Partial<Product>): Promise<Result<void>> {
  try {
    const products = await MyProductsRepository.getAll();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return Result.fail('Produto não encontrado no catálogo local.');
    }

    const updatedProduct = {
      ...product,
      ...data
    };

    await MyProductsRepository.save(updatedProduct);
    return Result.ok(undefined);
  } catch (err: any) {
    console.error('[UpdateProduct] Failed:', err);
    return Result.fail(err.message || 'Erro ao atualizar produto.');
  }
}
