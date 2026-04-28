import { Product } from '../../../types/api';
import { MyProductsRepository } from '../infra/MyProductsRepository';

/**
 * UseCase: Recupera todos os produtos selecionados pelo usuário
 */
export async function getSelectedProducts(): Promise<Product[]> {
  return MyProductsRepository.getAll();
}
