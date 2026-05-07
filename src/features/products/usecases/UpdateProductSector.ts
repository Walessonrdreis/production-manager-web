import { MyProductsRepository } from '../infra/MyProductsRepository';
import { sectorsLocalRepository } from '../../sectors/infra/SectorsIndexedDBRepo';
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

    const productCode = product.code;
    const currentSectors = product.sectorIds || [];
    let updatedSectors: string[];

    if (sectorId === undefined) {
      // Remover de todos os setores
      for (const sId of currentSectors) {
        await sectorsLocalRepository.removeProductFromSector(sId, productCode);
      }
      updatedSectors = [];
    } else {
      const exists = currentSectors.includes(sectorId);
      if (exists) {
        // Remover vínculo específico
        await sectorsLocalRepository.removeProductFromSector(sectorId, productCode);
        updatedSectors = currentSectors.filter(id => id !== sectorId);
      } else {
        // Adicionar vínculo específico
        await sectorsLocalRepository.addProductToSector(sectorId, productCode);
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
