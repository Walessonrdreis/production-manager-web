import { ProductionSchedule } from '../../../db/models';
import { FirebaseScheduleRepository } from './FirebaseScheduleRepository';
import { v4 as uuidv4 } from 'uuid';

export const ScheduleRepository = {
  async getAll(): Promise<ProductionSchedule[]> {
    try {
      const response = await FirebaseScheduleRepository.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('[ScheduleRepository] Modo offline: não foi possível buscar agendamentos.', error);
      return [];
    }
  },

  async save(schedule: ProductionSchedule): Promise<void> {
    try {
       const toSave = { ...schedule, id: schedule.id || uuidv4() };
       await FirebaseScheduleRepository.save(toSave);
    } catch (error) {
      console.warn('[ScheduleRepository] Erro ao sincronizar agendamento:', error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await FirebaseScheduleRepository.delete(id);
    } catch (error) {
      console.warn('[ScheduleRepository] Erro ao deletar agendamento:', error);
    }
  }
};
