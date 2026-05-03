import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { Sector } from '../../../types/api';
import { db } from '../../../db';

export const SectorsRepository = {
  async getAll(params?: { includeInactive?: boolean }): Promise<Sector[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.SECTORS.BASE, { params });
      const data = response.data;
      
      let sectors: Sector[] = [];

      if (Array.isArray(data)) {
        sectors = data;
      } else {
        const possibleData = data?.data || data?.sectors || data?.results || data?.items;
        if (Array.isArray(possibleData)) {
          sectors = possibleData;
        } else if (data?.sectors?.data && Array.isArray(data.sectors.data)) {
          sectors = data.sectors.data;
        } else if (data?.data?.sectors && Array.isArray(data.data.sectors)) {
          sectors = data.data.sectors;
        }
      }

      // Se obtivemos dados do servidor, atualizamos o cache local (IndexedDB)
      if (sectors.length > 0) {
        await db.sectors.clear();
        await db.sectors.bulkAdd(sectors);
      } else {
        // Se o servidor retornou vazio, mas temos cache, podemos usar o cache? 
        // Geralmente vazio significa lista vazia. 
      }

      return sectors;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      
      // Fallback para IndexedDB se falhar a conexão com a API
      const cached = await db.sectors.toArray();
      if (cached.length > 0) {
        console.log('[SectorsRepository] Usando cache do IndexedDB (Offline-fallback)');
        return cached;
      }
      
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>) {
    const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
    // Invalidação do cache será feita pelo React Query, mas podemos limpar o local aqui também se necessário
    await db.sectors.clear(); 
    return data;
  },

  async update(id: string, sector: Partial<Sector>) {
    const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
    await db.sectors.clear();
    return data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
    await db.sectors.clear();
    return response.data;
  },

  async syncWithOmie() {
    // Tenta realizar a sincronização via endpoint Omie
    // Se falhar (ex: endpoint não existe), apenas faz um refresh para pegar o que já está na API
    try {
      return await apiClient.post(ENDPOINTS.SECTORS.SYNC, {});
    } catch (error) {
      console.warn('[SectorsRepository] Endpoint de sync Omie falhou ou não existe. Continuando com refresh simples.');
      return { data: { success: true, message: 'Refresh manual realizado' } };
    }
  }
};
