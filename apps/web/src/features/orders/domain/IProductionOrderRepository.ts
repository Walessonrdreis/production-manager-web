import { ProductionOrder } from './ProductionOrder';

export interface IProductionOrderRepository {
  getAll(): Promise<{ success: boolean; data?: ProductionOrder[]; error?: string }>;
  getById(id: string): Promise<{ success: boolean; data?: ProductionOrder; error?: string }>;
  save(order: ProductionOrder): Promise<{ success: boolean; data?: ProductionOrder; error?: string }>;
  update(id: string, data: Partial<ProductionOrder>): Promise<{ success: boolean; data?: boolean; error?: string }>;
  delete(id: string): Promise<{ success: boolean; data?: boolean; error?: string }>;
}
