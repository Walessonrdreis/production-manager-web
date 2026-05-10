import { Collaborator } from '../../../types/api';
import { FirebaseCollaboratorsRepository } from './FirebaseCollaboratorsRepository';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const CollaboratorsRepository = {
  async getAll(): Promise<Collaborator[]> {
    try {
      // Firebase fallback priority
      const cachedResponse = await FirebaseCollaboratorsRepository.getAll();
      if (cachedResponse.success && cachedResponse.data && cachedResponse.data.length > 0) {
        return cachedResponse.data as unknown as Collaborator[];
      }

      // API
      try {
        const remoteResponse = await apiClient.get(ENDPOINTS.COLLABORATORS.BASE);
        let apiCollaborators = null;
        
        if (Array.isArray(remoteResponse.data)) {
          apiCollaborators = remoteResponse.data;
        } else if (remoteResponse.data?.data && Array.isArray(remoteResponse.data.data)) {
          apiCollaborators = remoteResponse.data.data;
        }

        if (apiCollaborators) {
          if (apiCollaborators.length > 0) {
            FirebaseCollaboratorsRepository.saveMany(apiCollaborators).catch((err: any) => console.log('Warn: Failed to save to firebase', err));
          }
          return apiCollaborators;
        }
      } catch (err) {
        console.warn('[CollaboratorsRepository] Falha ao buscar da API', err);
      }

      return [];
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao buscar colaboradores:', error);
      throw error;
    }
  },

  async create(collaborator: Omit<Collaborator, 'id'>) {
    const newId = crypto.randomUUID();
    const newCollaborator = {
      ...collaborator,
      id: newId
    };

    try {
      const remoteResponse = await apiClient.post(ENDPOINTS.COLLABORATORS.BASE, newCollaborator);
      let created = null;
      if (remoteResponse.data?.data) {
        created = remoteResponse.data.data;
      } else if (remoteResponse.data?.id) {
        created = remoteResponse.data;
      }
      
      if (created) {
        await FirebaseCollaboratorsRepository.save(created as any);
        return created;
      }
    } catch (error) {
      console.warn('[CollaboratorsRepository] Falha ao criar na API, salvando localmente:', error);
    }

    try {
      await FirebaseCollaboratorsRepository.save(newCollaborator as any);
      return newCollaborator;
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao criar colaborador:', error);
      return newCollaborator;
    }
  },

  async update(id: string, collaborator: Partial<Collaborator>) {
    try {
      await apiClient.put(`${ENDPOINTS.COLLABORATORS.BASE}/${id}`, collaborator).catch(err => {
        console.warn('[CollaboratorsRepository] Falha ao atualizar na API:', err);
      });
      await FirebaseCollaboratorsRepository.update(id, collaborator as any);
      return { id, ...collaborator };
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro ao atualizar colaborador:', error);
      return { id, ...collaborator };
    }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`${ENDPOINTS.COLLABORATORS.BASE}/${id}`).catch(err => {
        console.warn('[CollaboratorsRepository] Falha ao excluir na API:', err);
      });
      await FirebaseCollaboratorsRepository.delete(id);
    } catch (error) {
      console.error('[CollaboratorsRepository] Erro crítico ao excluir colaborador:', error);
    }
    return { success: true };
  }
};
