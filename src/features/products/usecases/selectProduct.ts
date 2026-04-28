import { Product } from '../../../types/api';
import { MyProductsRepository } from '../infra/MyProductsRepository';

/**
 * UseCase: Seleciona um produto do catálogo para uso local
 */
export async function selectProduct(product: Product): Promise<void> {
  await MyProductsRepository.save(product);
}
