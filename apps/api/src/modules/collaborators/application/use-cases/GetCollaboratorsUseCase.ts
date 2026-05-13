import { PrismaAdminCollaboratorsRepository } from '../../infrastructure/db/PrismaAdminCollaboratorsRepository.js';

export class GetCollaboratorsUseCase {
  static async execute() {
    const data = await PrismaAdminCollaboratorsRepository.getAll();
    return { data };
  }
}
