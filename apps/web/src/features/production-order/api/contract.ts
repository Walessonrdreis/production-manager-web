import { ProductionOrder, CreateProductionOrderDTO, UpdateProductionOrderDTO } from '../models/types';

export interface IProductionOrderService {
  list(): Promise<ProductionOrder[]>;
  getById(id: string): Promise<ProductionOrder | null>;
  create(data: CreateProductionOrderDTO): Promise<ProductionOrder>;
  update(id: string, data: UpdateProductionOrderDTO): Promise<ProductionOrder>;
  cancel(id: string): Promise<void>;
}
