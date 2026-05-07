import { Product } from '../../../types/api';
import { SavedProduct } from '../../../db/models';
import { productRepository } from '../../catalog/infra/ProductIndexedDBRepo';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { v4 as uuidv4 } from 'uuid';

export const MyProductsRepository = {
  async getAll(): Promise<SavedProduct[]> {
    try {
      // Tenta buscar da API primeiro (Fonte da Verdade)
      const { data: apiProducts } = await apiClient.get<SavedProduct[]>(ENDPOINTS.PRODUCTS.ADMIN);
      
      if (Array.isArray(apiProducts)) {
        // Sincroniza o IndexedDB
        const localProducts = await productRepository.getAll();
        const apiIds = new Set(apiProducts.map(p => p.id));
        
        // 1. Remove locais que sumiram da API e que JÁ ESTAVAM sincronizados (Sync de Deletados)
        for (const local of localProducts) {
          if (!apiIds.has(local.id) && local.synced) {
            await productRepository.delete(local.id);
          }
        }
        
        // Salva/Atualiza os da API
        for (const apiProd of apiProducts) {
          await productRepository.save({
            ...apiProd,
            synced: true,
            lastModified: Date.now()
          });
        }
        
        return apiProducts;
      }
    } catch (error) {
      console.warn('[MyProductsRepository] Falha ao buscar produtos da API, usando local:', error);
    }
    
    return productRepository.getAll();
  },

  async save(product: Product) {
    const savedProduct: SavedProduct = {
      ...product,
      id: (product as any).id || uuidv4(),
      synced: false,
      lastModified: Date.now(),
      version: 1,
      savedAt: new Date().toISOString(),
      sectorIds: (product as any).sectorIds || []
    };
    
    // Salva localmente primeiro
    await productRepository.save(savedProduct);
    
    // Tenta salvar na API
    try {
      await apiClient.post(ENDPOINTS.PRODUCTS.ADMIN, savedProduct);
      // Se sucesso, atualiza synced
      await productRepository.save({ ...savedProduct, synced: true });
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao salvar produto na API:', error);
    }
    
    return savedProduct;
  },

  async remove(productId: string) {
    // Tenta remover na API
    try {
      await apiClient.delete(`${ENDPOINTS.PRODUCTS.ADMIN}/${productId}`);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao remover produto na API:', error);
    }
    
    // Remove localmente idependente da API
    await productRepository.delete(productId);
  },

  async update(productId: string, data: Partial<SavedProduct>) {
    const existing = await productRepository.getById(productId);

    const updated = { ...(existing || {}), ...data, id: productId, synced: false, lastModified: Date.now() };
    await productRepository.save(updated as any);

    try {
      await apiClient.patch(`${ENDPOINTS.PRODUCTS.ADMIN}/${productId}`, data);
      await productRepository.save({ ...updated, synced: true } as any);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao atualizar produto na API:', error);
    }
  },

  async clear() {
    try {
      await apiClient.delete(ENDPOINTS.PRODUCTS.ADMIN);
    } catch (error) {
      console.error('[MyProductsRepository] Erro ao limpar produtos na API:', error);
    }
    
    const all = await productRepository.getAll();
    await Promise.all(all.map(p => productRepository.delete(p.id)));
  }
};
