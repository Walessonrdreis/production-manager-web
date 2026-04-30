import { Product } from '../../../types/api';
import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Recupera todos os produtos selecionados pelo usuário.
 */
export async function getSelectedProducts(): Promise<Result<Product[]>> {
  try {
    const products = await MyProductsRepository.getAll();
    return Result.ok(products);
  } catch (err) {
    return Result.fail('Erro ao recuperar produtos selecionados.');
  }
}
