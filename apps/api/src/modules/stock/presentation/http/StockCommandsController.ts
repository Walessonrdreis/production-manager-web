import { Request, Response } from "express";
import { z } from "zod";
import { GetStockPositionUseCase } from "../../application/use-cases/get-stock-position.usecase.js";

const GetStockPositionSchema = z.object({
  productId: z.string().min(1),
  externalRequestId: z.string().min(1),
  positionDateISO: z.string().optional(),
});

export class StockCommandsController {
  static async getPosition(req: Request, res: Response) {
    try {
      console.log("[CONTROLLER ENTRY - STOCK]", req.body);

      const payload = GetStockPositionSchema.parse(req.body);

      const useCase = new GetStockPositionUseCase();
      const result = await useCase.execute(payload);

      if (!result?.success) {
        if (result?.error === "VALIDATION_ERROR") {
          return res.status(400).json(result);
        }
        if (result?.error === "INTEGRATION_UNAVAILABLE") {
          return res.status(503).json(result);
        }
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Invalid request payload",
        });
      }

      return res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: error?.message || "Unexpected error",
      });
    }
  }
}

