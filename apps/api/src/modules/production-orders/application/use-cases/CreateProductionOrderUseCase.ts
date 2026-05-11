import { FirebaseAdminProductionOrderRepository } from '../../infrastructure/db/FirebaseAdminProductionOrderRepository.js';
import { CreateProductionOrderDTO } from '../dtos/ProductionOrderDTO.js';
import { v4 as uuidv4 } from 'uuid';

export class CreateProductionOrderUseCase {
  static async execute(data: CreateProductionOrderDTO) {
    const repo = new FirebaseAdminProductionOrderRepository();
    const now = new Date().toISOString();
    
    const newOrder = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const savedOrder = await repo.save(newOrder);
    return { data: savedOrder };
  }
}
