export interface CreateProductionOrderCommand {
  productId: string;
  quantity: number;
  scheduledDate?: string;
  notes?: string;
  externalRequestId: string;
}
