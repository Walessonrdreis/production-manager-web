import { Request, Response } from "express";
import { CreateProductionOrderUseCase } from "../../application/use-cases/create-production-order.usecase";

export class CreateProductionOrderController {
  constructor(
    private readonly useCase: CreateProductionOrderUseCase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const {
        productCode,
        quantity,
        scheduledDate,
        externalRequestId,
      } = req.body;

      // ✅ validação explícita (sem typeof)
      const qty = Number(quantity);

      if (
        !productCode ||
        !externalRequestId ||
        !scheduledDate ||
        isNaN(qty) ||
        qty <= 0
      ) {
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Invalid request payload",
        });
      }

      const result = await this.useCase.execute({
        productCode,
        quantity: qty,
        scheduledDate,
        externalRequestId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.code || "CREATE_OP_FAILED",
        message: err.message,
      });
    }
  }
}
