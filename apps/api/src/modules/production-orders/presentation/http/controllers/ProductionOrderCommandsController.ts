import { Request, Response } from 'express';
import { CreateProductionOrderUseCase } from '../../../application/use-cases/CreateProductionOrderUseCase.js';
import { CreateProductionOrderCommand } from '../../../application/dtos/CreateProductionOrderCommand.js';

export class ProductionOrderCommandsController {
  static async createOrder(req: Request, res: Response) {
    try {
      // 1. Verificar feature flag
      const commandsEnabled = process.env.COMMANDS_ENABLED === 'true';
      if (!commandsEnabled) {
        return res.status(501).json({ success: false, error: 'COMMANDS_DISABLED', message: 'Endpoint is not enabled' });
      }

      // 2. Extrair dados da requisição
      const productId = req.body.productId?.toString();
      const quantity = Number(req.body.quantity);
      const scheduledDate = req.body.scheduledDate;
      const notes = req.body.notes;
      const externalRequestId = req.body.externalRequestId?.toString();

      if (!productId || isNaN(quantity) || quantity <= 0 || !externalRequestId) {
        return res.status(400).json({ success: false, error: 'INVALID_PAYLOAD', message: 'Missing or invalid fields' });
      }

      const command: CreateProductionOrderCommand = {
        productId,
        quantity,
        scheduledDate,
        notes,
        externalRequestId
      };

      // 3. Executar o UseCase
      const result = await CreateProductionOrderUseCase.execute(command);
      
      if (!result.success) {
        if (result.error === 'VALIDATION_ERROR') {
          return res.status(400).json(result);
        }

        if (result.error === 'INTEGRATION_UNAVAILABLE') {
          return res.status(503).json(result);
        }

        return res.status(500).json(result);
      }

      // 4. Retornar dados com status apropriado
      return res.status(202).json(result);
    } catch (error: any) {
      console.error('[ProductionOrderCommandsController] Error:', error);
      return res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: error?.message || 'Unexpected error' });
    }
  }
}
