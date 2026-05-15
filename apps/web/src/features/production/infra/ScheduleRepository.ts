import { ProductionSchedule } from '../../../db/models';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ScheduleRepository = {
  async getAll(): Promise<ProductionSchedule[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTION.SCHEDULES);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('[ScheduleRepository] falha ao buscar agendamentos:', error);
      return [];
    }
  },

  async save(schedule: ProductionSchedule): Promise<void> {
    try {
       const toSave = { ...schedule, id: schedule.id || uuidv4() };
       await apiClient.post(ENDPOINTS.PRODUCTION.SCHEDULES, toSave);
    } catch (error) {
      console.error('[ScheduleRepository] Erro ao sincronizar agendamento:', error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.PRODUCTION.SCHEDULES}/${id}`);
    } catch (error) {
      console.error('[ScheduleRepository] Erro ao deletar agendamento:', error);
    }
  }
};
