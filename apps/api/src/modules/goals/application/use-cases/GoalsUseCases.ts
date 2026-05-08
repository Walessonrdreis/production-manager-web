import { FirebaseAdminGoalsRepository } from '../../infrastructure/db/FirebaseAdminGoalsRepository.js';

export class GoalsUseCases {
  static async getAll() {
    return await FirebaseAdminGoalsRepository.getAll();
  }

  static async getById(id: string) {
    return await FirebaseAdminGoalsRepository.getById(id);
  }

  static async create(data: any) {
    return await FirebaseAdminGoalsRepository.save(data);
  }

  static async update(id: string, data: any) {
    return await FirebaseAdminGoalsRepository.update(id, data);
  }

  static async delete(id: string) {
    return await FirebaseAdminGoalsRepository.delete(id);
  }
}
