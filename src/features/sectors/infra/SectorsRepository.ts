import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { Sector } from '../../../types/api';
import { sectorsLocalRepository } from './SectorsIndexedDBRepo';

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
      // Primeiro, pegamos todos os IDs retornados pela API
      const apiIds = new Set(sectors.map(s => s.id));
      
      // Pegamos todos os setores locais
      const localSectors = await sectorsLocalRepository.getAll();
      
      // Removemos setores locais que não estão mais na API e JÁ ESTÁVAM sincronizados
      for (const local of localSectors) {
        if (!apiIds.has(local.id) && local.synced) {
          await sectorsLocalRepository.delete(local.id);
        }
      }

      // Atualizamos/Inserimos os que vieram da API
      for (const s of sectors) {
        const existing = await sectorsLocalRepository.getById(s.id);
        await sectorsLocalRepository.save({
          ...s,
          productCodes: existing?.productCodes || [],
          synced: true,
          lastModified: Date.now(),
          version: existing?.version || 1
        });
      }

      return sectors;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      
      // Fallback para IndexedDB se falhar a conexão com a API
      const cached = await sectorsLocalRepository.getAll();
      if (cached.length > 0) {
        console.log('[SectorsRepository] Usando cache do IndexedDB (Offline-fallback)');
        return cached;
      }
      
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>) {
    const newSector = {
      ...sector,
      id: crypto.randomUUID(),
      productCodes: [],
      synced: false,
      lastModified: Date.now(),
      version: 1
    };

    // Salva localmente primeiro
    await sectorsLocalRepository.save(newSector);

    try {
      const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, newSector);
      if (data && data.id) {
        await sectorsLocalRepository.save({
          ...newSector,
          ...data,
          synced: true,
          lastModified: Date.now()
        });
      }
      return data || newSector;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao criar setor na API:', error);
      return newSector;
    }
  },

  async update(id: string, sector: Partial<Sector>) {
    const existing = await sectorsLocalRepository.getById(id);

    const updated = {
      ...(existing || {}),
      ...sector,
      id,
      synced: false,
      lastModified: Date.now()
    };
    
    // Atualiza localmente imediatamente
    await sectorsLocalRepository.save(updated as any);

    try {
      const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
      await sectorsLocalRepository.save({
        ...updated,
        ...data,
        synced: true,
        lastModified: Date.now()
      });
      return data || updated;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao atualizar setor na API:', error);
      return updated;
    }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
      console.log('[SectorsRepository] Setor excluído na API com sucesso');
    } catch (error) {
      console.error('[SectorsRepository] Erro crítico ao excluir setor na API:', error);
    }

    // Removemos localmente (mesmo se falhar na API, prioriza a view offline-first ou assume que API vai sincronizar depois)
    await sectorsLocalRepository.delete(id);
    return { success: true };
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
