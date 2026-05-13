import { PrismaAdminCollaboratorsRepository } from '../../infrastructure/db/PrismaAdminCollaboratorsRepository.js';

export class DeleteCollaboratorUseCase {
  static async execute(id: string) {
    await PrismaAdminCollaboratorsRepository.delete(id);
    return { success: true };
  }
}
