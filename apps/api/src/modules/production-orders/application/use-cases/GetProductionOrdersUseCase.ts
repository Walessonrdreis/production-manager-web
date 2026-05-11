import { FirebaseAdminProductionOrderRepository } from '../../infrastructure/db/FirebaseAdminProductionOrderRepository.js';

export class GetProductionOrdersUseCase {
  static async execute() {
    const repo = new FirebaseAdminProductionOrderRepository();
    const orders = await repo.getAll();
    return { data: orders };
  }
}
