import { ApiMyProductsRepository } from './infra/ApiMyProductsRepository';
import { Product } from '../../types/api';

export const selectProduct = async (product: Product) => {
  try {
    await ApiMyProductsRepository.save({
      ...product,
      savedAt: Date.now()
    } as any);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const unselectProduct = async (id: string) => {
  try {
    await ApiMyProductsRepository.delete(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSelectedProducts = async () => {
  try {
    const products = await ApiMyProductsRepository.getAll();
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const clearMyProducts = async () => {
  try {
    await ApiMyProductsRepository.clear();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateProductSector = async (productId: string, sectorId: string | undefined) => {
  try {
    await ApiMyProductsRepository.update(productId, { sectorId } as any);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId: string, data: Partial<Product>) => {
  try {
    await ApiMyProductsRepository.update(productId, data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
