import { Api1StockIntegrationClient } from "../../infrastructure/integration/Api1StockIntegrationClient.js";

export class GetStockPositionUseCase {
  async execute(command: {
    productId: string;
    externalRequestId: string;
    positionDateISO?: string;
  }) {
    console.log("[USECASE ENTRY - STOCK]", command);
    return Api1StockIntegrationClient.getPosition(command);
  }
}

