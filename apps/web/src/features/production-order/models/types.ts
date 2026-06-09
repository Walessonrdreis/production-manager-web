export type ProductionOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface ProductionOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

export interface ProductionOrder {
  id: string;
  code: string;
  status: ProductionOrderStatus;
  createdAt: string;
  updatedAt: string;
  items: ProductionOrderItem[];
  notes?: string;
}

export interface CreateProductionOrderDTO {
  items: Omit<ProductionOrderItem, 'id' | 'productName'>[];
  notes?: string;
}

export interface UpdateProductionOrderDTO {
  status?: ProductionOrderStatus;
  notes?: string;
}
