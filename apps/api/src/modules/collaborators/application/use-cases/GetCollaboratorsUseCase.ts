import { FirebaseAdminCollaboratorsRepository } from '../../infrastructure/db/FirebaseAdminCollaboratorsRepository.js';

export class GetCollaboratorsUseCase {
  static async execute() {
    const data = await FirebaseAdminCollaboratorsRepository.getAll();
    return { data };
  }
}
