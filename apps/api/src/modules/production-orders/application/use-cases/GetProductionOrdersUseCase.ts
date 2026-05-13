import { PrismaProductionOrderRepository } from '../../infrastructure/db/PrismaProductionOrderRepository.js';

export class GetProductionOrdersUseCase {
  static async execute() {
    const repo = new PrismaProductionOrderRepository();
    const orders = await repo.getAll();
    return { data: orders };
  }
}
