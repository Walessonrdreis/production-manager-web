import { Request, Response, NextFunction } from 'express';
import { ProcessTrelloWebhookUseCase } from '../../../application/use-cases/ProcessTrelloWebhookUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class TrelloWebhookController {
  /**
   * Trello uses this to verify the webhook URL.
   * Must always return 200 HTTP OK.
   */
  static async verifyWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send('OK');
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * Receives actions from Trello, logs them and delegates to the use case.
   * Trello requires 200 OK to keep the webhook active.
   */
  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      
      const actionType = payload?.action?.type;
      const cardId = payload?.action?.data?.card?.id;
      
      if (actionType && cardId) {
        console.log(`[TrelloWebhook] Received ${actionType} for card ${cardId}`);
      } else {
        console.log(`[TrelloWebhook] Received unknown payload`);
      }

      // Delegate to use case
      const useCase = new ProcessTrelloWebhookUseCase();
      const decision = await useCase.execute(payload);
      
      console.log(`[TrelloWebhook] Decision: ${decision.reason} | Should create OP: ${decision.shouldCreateProductionOrder}`);

      // Must always respond with 200 to Trello
      res.status(200).send('OK');
    } catch (err: any) {
      // Must return 200 even on error so Trello doesn't disable the webhook
      console.error('[TrelloWebhook] Error processing webhook:', err);
      res.status(200).send('OK');
    }
  }
}
