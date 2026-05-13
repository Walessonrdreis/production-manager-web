import { PrismaProductionOrderRepository } from '../../infrastructure/db/PrismaProductionOrderRepository.js';
import { UpdateProductionOrderDTO } from '../dtos/ProductionOrderDTO.js';

export class UpdateProductionOrderUseCase {
  static async execute(id: string, data: UpdateProductionOrderDTO) {
    const repo = new PrismaProductionOrderRepository();
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    const updatedOrder = await repo.update(id, updatedData);
    return { data: updatedOrder };
  }
}
