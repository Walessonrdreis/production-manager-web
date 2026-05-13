import { PrismaAdminCollaboratorsRepository } from '../../infrastructure/db/PrismaAdminCollaboratorsRepository.js';

export class CreateCollaboratorUseCase {
  static async execute(data: any) {
    const created = await PrismaAdminCollaboratorsRepository.save(data);
    return { data: created };
  }
}
