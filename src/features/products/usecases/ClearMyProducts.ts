import { MyProductsRepository } from '../infra/MyProductsRepository';

export async function clearMyProducts() {
  return MyProductsRepository.clear();
}
