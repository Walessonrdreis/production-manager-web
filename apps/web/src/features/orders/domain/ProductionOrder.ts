export type ProductionOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ProductionOrder {
  id: string;
  lote: string; // The user specifically requested this
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
