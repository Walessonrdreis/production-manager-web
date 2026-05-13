import { PrismaAdminGoalsRepository } from '../../infrastructure/db/PrismaAdminGoalsRepository.js';

export class GoalsUseCases {
  static async getAll() {
    return await PrismaAdminGoalsRepository.getAll();
  }

  static async getById(id: string) {
    return await PrismaAdminGoalsRepository.getById(id);
  }

  static async create(data: any) {
    return await PrismaAdminGoalsRepository.save(data);
  }

  static async update(id: string, data: any) {
    return await PrismaAdminGoalsRepository.update(id, data);
  }

  static async delete(id: string) {
    return await PrismaAdminGoalsRepository.delete(id);
  }
}
