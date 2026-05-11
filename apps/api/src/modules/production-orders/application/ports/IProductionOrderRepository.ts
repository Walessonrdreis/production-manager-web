import { ProductionOrderDTO } from '../dtos/ProductionOrderDTO.js';

export interface IProductionOrderRepository {
  getAll(): Promise<ProductionOrderDTO[]>;
  getById(id: string): Promise<ProductionOrderDTO | null>;
  save(order: ProductionOrderDTO): Promise<ProductionOrderDTO>;
  update(id: string, data: Partial<ProductionOrderDTO>): Promise<ProductionOrderDTO>;
  delete(id: string): Promise<void>;
}
