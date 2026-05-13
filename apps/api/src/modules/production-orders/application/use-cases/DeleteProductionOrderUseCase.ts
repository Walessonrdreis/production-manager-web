import { PrismaProductionOrderRepository } from '../../infrastructure/db/PrismaProductionOrderRepository.js';

export class DeleteProductionOrderUseCase {
  static async execute(id: string) {
    const repo = new PrismaProductionOrderRepository();
    await repo.delete(id);
    return { success: true };
  }
}
