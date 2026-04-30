import { Product } from '../../../types/api';
import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Seleciona um produto do catálogo para uso local.
 */
export async function selectProduct(product: Product): Promise<Result<void>> {
  try {
    await MyProductsRepository.save(product);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao salvar produto nos favoritos.');
  }
}
