import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';

export async function clearMyProducts(): Promise<Result<void>> {
  try {
    await MyProductsRepository.clear();
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao limpar favoritos.');
  }
}
