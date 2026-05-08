import { Product } from '../../../types/api';
import { SavedProduct } from '../../../db/models';
import { productRepository } from '../../catalog/infra/ProductIndexedDBRepo';
import { FirebaseProductRepository } from './FirebaseProductRepository';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const MyProductsRepository = {
  async getAll(): Promise<SavedProduct[]> {
    try {
      const response = await FirebaseProductRepository.getAll();
      if (response.success && response.data) {
        return response.data as SavedProduct[];
      }
      return [];
    } catch (error) {
      console.error('[MyProductsRepository] Falha ao buscar produtos no Firebase:', error);
      return [];
    }
  },

  async save(product: Product) {
    const savedProduct: SavedProduct = {
      ...product,
      id: (product as any).id || uuidv4(),
      synced: true,
      lastModified: Date.now(),
      version: 1,
      savedAt: new Date().toISOString(),
      sectorIds: (product as any).sectorIds || []
    };
    
    try {
      await FirebaseProductRepository.save(savedProduct);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao salvar produto:', error);
    }
    
    return savedProduct;
  },

  async remove(productId: string) {
    try {
      await FirebaseProductRepository.delete(productId);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao remover produto:', error);
    }
  },

  async update(productId: string, data: Partial<SavedProduct>) {
    try {
      await FirebaseProductRepository.update(productId, data);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao atualizar produto:', error);
    }
  },

  async clear() {
    try {
      const all = await this.getAll();
      await Promise.all(all.map(p => this.remove(p.id)));
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao limpar produtos:', error);
    }
  }
};
