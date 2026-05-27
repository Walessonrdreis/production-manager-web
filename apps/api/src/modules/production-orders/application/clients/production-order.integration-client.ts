export interface ProductionOrderIntegrationClient {
  createProductionOrder(command: {
    productId: string;
    quantity: number;
    scheduledDate: string;
    externalRequestId: string;
  }): Promise<void>;
}
