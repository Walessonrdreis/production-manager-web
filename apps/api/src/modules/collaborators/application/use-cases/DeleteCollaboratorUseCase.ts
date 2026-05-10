import { FirebaseAdminCollaboratorsRepository } from '../../infrastructure/db/FirebaseAdminCollaboratorsRepository.js';

export class DeleteCollaboratorUseCase {
  static async execute(id: string) {
    await FirebaseAdminCollaboratorsRepository.delete(id);
    return { success: true };
  }
}
