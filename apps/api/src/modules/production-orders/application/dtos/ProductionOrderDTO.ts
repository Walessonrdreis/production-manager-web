export type ProductionOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ProductionOrderDTO {
  id: string;
  lote: string;
  productId?: string;
  productCode: string;
  productDescription: string;
  quantity: number;
  sectorId?: string;
  sectorName?: string;
  collaboratorId?: string;
  collaboratorName?: string;
  status: ProductionOrderStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductionOrderDTO = Omit<ProductionOrderDTO, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductionOrderDTO = Partial<ProductionOrderDTO>;
