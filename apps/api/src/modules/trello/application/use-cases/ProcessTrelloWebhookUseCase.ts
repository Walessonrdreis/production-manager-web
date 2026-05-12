import { CreateProductionOrderUseCase } from '../../../production-orders/application/use-cases/CreateProductionOrderUseCase.js';
import { CreateProductionOrderDTO } from '../../../production-orders/application/dtos/ProductionOrderDTO.js';
import { parseTrelloCardName } from '../utils/parseTrelloCardName.js';

export interface ProcessTrelloWebhookResult {
  shouldCreateProductionOrder: boolean;
  reason: string;
  cardId?: string;
}

export class ProcessTrelloWebhookUseCase {
  // Lista oficial: TEMPERADOS - BARRAS
  private readonly TARGET_LIST_ID = '672a2824e7f42ce048d73ead';

  async execute(payload: any): Promise<ProcessTrelloWebhookResult> {
    const decision = this.evaluatePayload(payload);

    if (decision.shouldCreateProductionOrder && decision.cardId) {
      const cardName = payload?.action?.data?.card?.name;
      const parsedData = parseTrelloCardName(cardName || '');

      if (parsedData) {
        try {
          const dto: CreateProductionOrderDTO = {
            lote: parsedData.lot,
            quantity: parsedData.quantity,
            productCode: parsedData.code || '',
            productDescription: parsedData.name || 'Produto não identificado pelo Trello',
            // O sistema base suporta pending, in_progress, completed, cancelled. 
            // O requisito pede DRAFT / NEEDS_REVIEW. Usando pending para compatibilidade e adicionando nas notas.
            status: 'pending',
            notes: 'Origem: Trello. ' + (parsedData.code ? '' : 'NEEDS_REVIEW: Produto precisa ser revisado.'),
            // Ignorando source nativamente pois DTO não possui suporte, mas forçando cast se necessário
            ...({ source: 'TRELLO', trelloCardId: decision.cardId } as any)
          };

          await CreateProductionOrderUseCase.execute(dto);
          decision.reason += ' | OP successfully created';
        } catch (error: any) {
          console.error(`[ProcessTrelloWebhookUseCase] Error creating OP for card ${decision.cardId}:`, error);
          decision.reason += ` | Error creating OP: ${error.message}`;
        }
      } else {
        decision.reason += ' | Card name could not be parsed, OP not created';
      }
    }

    return decision;
  }

  private evaluatePayload(payload: any): ProcessTrelloWebhookResult {
    if (!payload?.action?.type) {
      return { shouldCreateProductionOrder: false, reason: 'Invalid or missing action type' };
    }

    const actionType = payload.action.type;
    const data = payload.action.data;
    const cardId = data?.card?.id;

    if (!cardId) {
      return { shouldCreateProductionOrder: false, reason: 'No card data found in payload' };
    }

    switch (actionType) {
      case 'createCard':
      case 'copyCard': {
        const listId = data.list?.id || data.card?.idList;
        if (listId === this.TARGET_LIST_ID) {
          return { 
            shouldCreateProductionOrder: true, 
            reason: `Card entered the target list via ${actionType}`,
            cardId
          };
        }
        return { 
          shouldCreateProductionOrder: false, 
          reason: `Card created/copied in a different list: ${listId}`,
          cardId
        };
      }

      case 'updateCard': {
        const listAfterId = data.listAfter?.id;
        
        if (listAfterId) {
          if (listAfterId === this.TARGET_LIST_ID) {
            return { 
              shouldCreateProductionOrder: true, 
              reason: 'Card moved into the target list',
              cardId
            };
          }
          return { 
            shouldCreateProductionOrder: false, 
            reason: `Card moved to a different list: ${listAfterId}`,
            cardId
          };
        }
        
        return { 
          shouldCreateProductionOrder: false, 
          reason: 'Card updated but not moved (list did not change)',
          cardId
        };
      }

      default:
        return { 
          shouldCreateProductionOrder: false, 
          reason: `Ignored irrelevant action type: ${actionType}`,
          cardId
        };
    }
  }
}

