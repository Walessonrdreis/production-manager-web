import { GetStockPositionUseCase } from "../../application/use-cases/get-stock-position.usecase.js";

export class StockCommandsController {
  static async getPosition(req: any, res: any) {
    try {
      console.log("[CONTROLLER ENTRY - STOCK]", req.body);

      const productId = req.body.productId?.toString();
      const positionDateISO = req.body.positionDateISO?.toString();
      const externalRequestId = req.body.externalRequestId?.toString();

      if (!productId || !externalRequestId) {
        return res.status(400).json({
          success: false,
          error: "INVALID_PAYLOAD",
          message: "productId and externalRequestId are required"
        });
      }

      const result = await GetStockPositionUseCase.execute({
        productId,
        positionDateISO,
        externalRequestId
      });

      return res.status(result.success ? 200 : 500).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: error?.message || "Unexpected error"
      });
    }
  }
}
