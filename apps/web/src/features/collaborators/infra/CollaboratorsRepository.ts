import { Collaborator } from '../../../types/api';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const CollaboratorsRepository = {
  async getAll(): Promise<Collaborator[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.COLLABORATORS.BASE);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao buscar colaboradores da API:', error);
      throw error;
    }
  },

  async create(collaborator: Omit<Collaborator, 'id'>): Promise<Collaborator> {
    try {
      const response = await apiClient.post(ENDPOINTS.COLLABORATORS.BASE, collaborator);
      if (response.data?.data) {
        return response.data.data;
      } else if (response.data?.id) {
        return response.data;
      }
      throw new Error('Falha ao criar colaborador');
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao criar colaborador:', error);
      throw error;
    }
  },

  async update(id: string, collaborator: Partial<Collaborator>): Promise<Partial<Collaborator>> {
    try {
      const response = await apiClient.put(`${ENDPOINTS.COLLABORATORS.BASE}/${id}`, collaborator);
      if (response.data?.data) {
        return response.data.data;
      }
      return { id, ...collaborator };
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao atualizar colaborador:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`${ENDPOINTS.COLLABORATORS.BASE}/${id}`);
      return { success: true };
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro crítico ao excluir colaborador:', error);
      throw error;
    }
  }
};
