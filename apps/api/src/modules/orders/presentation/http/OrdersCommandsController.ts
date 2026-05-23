import { Request, Response } from "express";
import { z } from "zod";
import { GetOrdersStage20UseCase } from "../../application/use-cases/get-orders-stage20.usecase.js";

const Schema = z.object({
  externalRequestId: z.string().min(1),
});

export class OrdersCommandsController {
  static async stage20(req: Request, res: Response) {
    try {
      const payload = Schema.parse(req.body);
      const useCase = new GetOrdersStage20UseCase();
      const result = await useCase.execute(payload);

      if (!result?.success) {
        // se tiver retryAfterSeconds, é rate limit / indisponibilidade
        if (result?.error === "INTEGRATION_UNAVAILABLE") {
          return res.status(503).json(result);
        }
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Invalid request payload",
      });
    }
  }
}
