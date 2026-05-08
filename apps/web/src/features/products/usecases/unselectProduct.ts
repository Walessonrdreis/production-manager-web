import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Remove um produto da seleção local.
 */
export async function unselectProduct(productId: string): Promise<Result<void>> {
  try {
    await MyProductsRepository.remove(productId);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover produto dos favoritos.');
  }
}
