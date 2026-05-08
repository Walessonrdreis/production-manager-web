import { Sector } from '../../../types/api';
import { FirebaseSectorRepository } from './FirebaseSectorRepository';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const SectorsRepository = {
  async getAll(params?: { includeInactive?: boolean }): Promise<Sector[]> {
    try {
      // Tentar buscar da Firebase primeiro como prioritário
      const cachedResponse = await FirebaseSectorRepository.getAll();
      if (cachedResponse.success && cachedResponse.data && cachedResponse.data.length > 0) {
        return cachedResponse.data as unknown as Sector[];
      }

      // Fallback API
      try {
        const remoteResponse = await apiClient.get(ENDPOINTS.SECTORS.BASE);
        let apiSectors = null;
        console.log('[SectorsRepository] API Response:', remoteResponse.data);
        
        // Verifica se a resposta é um array diretamente (padrão de algumas APIs)
        if (Array.isArray(remoteResponse.data)) {
          apiSectors = remoteResponse.data;
        } 
        // Verifica padrão { success: true, data: [...] } ou { data: [...] }
        else if (remoteResponse.data?.data && Array.isArray(remoteResponse.data.data)) {
          apiSectors = remoteResponse.data.data;
        }
        else if (remoteResponse.data?.sectors && Array.isArray(remoteResponse.data.sectors)) {
          apiSectors = remoteResponse.data.sectors;
        }

        if (apiSectors) {
          // Sincroniza silenciosamente com o firebase
          if (apiSectors.length > 0) {
            (FirebaseSectorRepository as any).saveMany(apiSectors).catch((err: any) => console.log('Warn: Failed to save to firebase', err));
          }
          
          return apiSectors;
        }
      } catch (err) {
        console.warn('[SectorsRepository] Falha ao buscar da API', err);
      }

      return [];
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>) {
    const newSector = {
      ...sector,
      id: crypto.randomUUID() // fallback id
    };

    try {
      // Create remotely
      const remoteResponse = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
      let created = null;
      if (remoteResponse.data) {
        if (remoteResponse.data.data) {
          created = remoteResponse.data.data;
        } else if (remoteResponse.data.id) {
          created = remoteResponse.data;
        } else if (remoteResponse.data.sector) {
          created = remoteResponse.data.sector;
        }
      }
      
      if (created) {
        await FirebaseSectorRepository.save(created as any);
        return created;
      }
    } catch (error) {
      console.warn('[SectorsRepository] Falha ao criar na API, salvando localmente:', error);
    }

    try {
      await FirebaseSectorRepository.save(newSector as any);
      return newSector;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao criar setor:', error);
      return newSector;
    }
  },

  async update(id: string, sector: Partial<Sector>) {
    try {
      // Update remotely
      await apiClient.put(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector).catch(err => {
        console.warn('[SectorsRepository] Falha ao atualizar na API:', err);
      });
      await FirebaseSectorRepository.update(id, sector as any);
      return { id, ...sector };
    } catch (error) {
      console.error('[SectorsRepository] Erro ao atualizar setor:', error);
      return { id, ...sector };
    }
  },

  async delete(id: string) {
    try {
      // Delete remotely
      await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`).catch(err => {
        console.warn('[SectorsRepository] Falha ao excluir na API:', err);
      });
      await FirebaseSectorRepository.delete(id);
    } catch (error) {
      console.error('[SectorsRepository] Erro crítico ao excluir setor:', error);
    }
    return { success: true };
  }
};
