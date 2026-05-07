import { db } from '../../../db';
import { ProductionSchedule } from '../../../db/models';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ScheduleRepository = {
  async getAll(): Promise<ProductionSchedule[]> {
    try {
      const { data: apiItems } = await apiClient.get<ProductionSchedule[]>(ENDPOINTS.PRODUCTION.SCHEDULES);
      if (apiItems && Array.isArray(apiItems)) {
        const localItems = await db.productionSchedules.toArray();
        const apiIds = new Set(apiItems.map(i => i.description));
        
        // Remove locais que sumiram na API
        for (const local of localItems) {
          if (!apiIds.has(local.description)) {
            await db.productionSchedules.delete(local.description);
          }
        }

        // Salva/Atualiza com dados da API
        for (const apiItem of apiItems) {
          if (!apiItem.description) continue;
          await db.productionSchedules.put(apiItem);
        }
      }
    } catch (error) {
      console.warn('[ScheduleRepository] Modo offline: não foi possível buscar agendamentos.', error);
    }
    
    return db.productionSchedules.toArray();
  },

  async save(schedule: ProductionSchedule): Promise<void> {
    await db.productionSchedules.put(schedule);
    
    try {
      await apiClient.post(ENDPOINTS.PRODUCTION.SCHEDULES, schedule);
    } catch (error) {
      console.warn('[ScheduleRepository] Erro ao sincronizar agendamento:', error);
    }
  },

  async delete(description: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.PRODUCTION.SCHEDULES}/${description}`);
    } catch (error) {
      console.warn('[ScheduleRepository] Erro ao deletar agendamento:', error);
    }
    await db.productionSchedules.delete(description);
  }
};
