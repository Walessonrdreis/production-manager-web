import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { Sector } from '../../../types/api';

export const SectorsRepository = {
  async getAll(params?: { includeInactive?: boolean }): Promise<Sector[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.SECTORS.BASE, { params });
      const data = response.data;
      
      // Desenvolvimento e Depuração: Log para identificar formato real caso falhe
      if (!data) return [];

      // Cenário 1: Retorno direto do array
      if (Array.isArray(data)) return data;

      // Cenário 2: Retorno envelopado em objeto (padrão comum)
      // Tenta extrair de chaves comuns: data, sectors, results, items
      const possibleData = data.data || data.sectors || data.results || data.items;
      if (Array.isArray(possibleData)) return possibleData;

      // Cenário 3: Envelopamento duplo (ex: { success: true, sectors: { data: [...] } })
      if (data.sectors?.data && Array.isArray(data.sectors.data)) return data.sectors.data;
      if (data.data?.sectors && Array.isArray(data.data.sectors)) return data.data.sectors;

      // Se chegamos aqui e 'data' é um objeto, mas não encontramos array
      console.warn('[SectorsRepository] Formato de resposta inesperado:', {
        type: typeof data,
        keys: data ? Object.keys(data) : 'null/undefined',
        data
      });
      return [];
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>) {
    const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
    return data;
  },

  async update(id: string, sector: Partial<Sector>) {
    const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
    return data;
  },

  async delete(id: string) {
    console.log(`[SectorsRepository] Deletando setor ID: ${id}`);
    try {
      const response = await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
      console.log(`[SectorsRepository] Resposta delete:`, response.status);
      return response.data;
    } catch (error: any) {
      console.error(`[SectorsRepository] Erro ao deletar setor ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};
