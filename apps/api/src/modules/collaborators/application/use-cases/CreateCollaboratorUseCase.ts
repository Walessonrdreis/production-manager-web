import { FirebaseAdminCollaboratorsRepository } from '../../infrastructure/db/FirebaseAdminCollaboratorsRepository.js';

export class CreateCollaboratorUseCase {
  static async execute(data: any) {
    const created = await FirebaseAdminCollaboratorsRepository.save(data);
    return { data: created };
  }
}
