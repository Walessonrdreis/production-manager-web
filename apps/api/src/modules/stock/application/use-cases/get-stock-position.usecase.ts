import { Api1StockClient } from "../../infrastructure/integration/Api1StockClient.js";

export class GetStockPositionUseCase {
  static async execute(command: {
    productId: string;
    positionDateISO?: string;
    externalRequestId: string;
  }) {
    console.log("[USECASE ENTRY - STOCK]", command);
    return Api1StockClient.getPosition(command);
  }
}
