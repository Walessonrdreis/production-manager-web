import { MyProductsRepository } from '../infra/MyProductsRepository';

/**
 * UseCase: Remove um produto da seleção local
 */
export async function unselectProduct(productId: string): Promise<void> {
  await MyProductsRepository.remove(productId);
}
