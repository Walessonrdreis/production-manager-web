import { FirebaseAdminCollaboratorsRepository } from '../../infrastructure/db/FirebaseAdminCollaboratorsRepository.js';

export class UpdateCollaboratorUseCase {
  static async execute(id: string, data: any) {
    const updated = await FirebaseAdminCollaboratorsRepository.update(id, data);
    return { data: updated };
  }
}
