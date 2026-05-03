import { MyProductsRepository } from '../infra/MyProductsRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Atribui um setor a um produto no catálogo local.
 */
export async function updateProductSector(productId: string, sectorId: string | undefined): Promise<Result<void>> {
  try {
    const products = await MyProductsRepository.getAll();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return Result.fail('Produto não encontrado no catálogo local.');
    }

    const currentSectors = product.sectorIds || [];
    let updatedSectors: string[];

    if (sectorId === undefined) {
      // Clear all
      updatedSectors = [];
    } else {
      const exists = currentSectors.includes(sectorId);
      if (exists) {
        // Remove
        updatedSectors = currentSectors.filter(id => id !== sectorId);
      } else {
        // Add
        updatedSectors = [...currentSectors, sectorId];
      }
    }

    const updatedProduct = {
      ...product,
      sectorIds: updatedSectors
    };

    await MyProductsRepository.save(updatedProduct);
    return Result.ok(undefined);
  } catch (err: any) {
    console.error('[UpdateProductSector] Failed:', err);
    return Result.fail(err.message || 'Erro ao atualizar setores do produto.');
  }
}
