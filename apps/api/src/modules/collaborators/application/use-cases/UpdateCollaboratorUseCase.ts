import { PrismaAdminCollaboratorsRepository } from '../../infrastructure/db/PrismaAdminCollaboratorsRepository.js';

export class UpdateCollaboratorUseCase {
  static async execute(id: string, data: any) {
    const updated = await PrismaAdminCollaboratorsRepository.update(id, data);
    return { data: updated };
  }
}
