import { FirebaseAdminProductionOrderRepository } from '../../infrastructure/db/FirebaseAdminProductionOrderRepository.js';

export class DeleteProductionOrderUseCase {
  static async execute(id: string) {
    const repo = new FirebaseAdminProductionOrderRepository();
    await repo.delete(id);
    return { success: true };
  }
}
