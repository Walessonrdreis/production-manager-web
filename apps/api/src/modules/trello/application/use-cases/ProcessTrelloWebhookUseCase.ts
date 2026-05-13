import { CreateProductionOrderUseCase } from '../../../production-orders/application/use-cases/CreateProductionOrderUseCase.js';
import { CreateProductionOrderDTO } from '../../../production-orders/application/dtos/ProductionOrderDTO.js';
import { parseTrelloCardName } from '../utils/parseTrelloCardName.js';
import { ProductsAdapter } from '../../../catalog/infrastructure/integrations/catalog.adapter.js';

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
      const cardName = payload?.action?.data?.card?.name || '';
      const cardDesc = payload?.action?.data?.card?.desc || '';
      
      let parsedData = parseTrelloCardName(cardName);

      // 1. Resolver Lote se estiver vazio ou '1'
      if (parsedData && (!parsedData.lot || parsedData.lot === '1' || parsedData.lot === '')) {
        const descMatch = cardDesc.match(/Lote:\s*(\S+)/i);
        if (descMatch) {
          parsedData.lot = descMatch[1];
        }
      }

      // Se não parseou nada, tenta ver se pelo menos tem o lote na descrição para criar algo básico
      if (!parsedData) {
        const descMatch = cardDesc.match(/Lote:\s*(\S+)/i);
        if (descMatch) {
          parsedData = {
            name: cardName,
            lot: descMatch[1],
            quantity: 1
          };
        }
      }

      if (parsedData) {
        try {
          let finalProductDescription = parsedData.name || 'Produto não identificado';
          let finalProductCode = parsedData.code || '';

          // Se tiver 4 partes, parsedData.code é o código.
          // Se tiver 3 partes, parsedData.name PODE ser o código ou o nome.
          // Tentamos resolver pelo que vier em parsedData.code primeiro, depois pelo name como fallback de código.
          const codeToLookup = parsedData.code || parsedData.name;

          if (codeToLookup) {
            try {
              // Busca no catálogo oficial (API Omie via Render)
              const allProducts = await ProductsAdapter.fetchFromExternalAPI();
              const foundProduct = allProducts.find((p: any) => 
                p.code === codeToLookup || p.description?.toLowerCase() === codeToLookup?.toLowerCase()
              );

              if (foundProduct) {
                finalProductDescription = foundProduct.description;
                finalProductCode = foundProduct.code;
              } else if (parsedData.code) {
                // Se o código foi explicitamente passado mas não achou no catálogo
                finalProductDescription = parsedData.name || 'Produto (Código não encontrado)';
              }
            } catch (catalogErr) {
              console.warn('[ProcessTrelloWebhookUseCase] Failed to fetch catalog:', catalogErr);
            }
          }

          const dto: CreateProductionOrderDTO = {
            lote: parsedData.lot || 'S/L',
            quantity: parsedData.quantity,
            productCode: finalProductCode,
            productDescription: finalProductDescription,
            status: 'pending',
            notes: `Origem: Trello. ${cardDesc ? '\nDescrição: ' + cardDesc : ''}`,
            ...({ source: 'TRELLO', trelloCardId: decision.cardId } as any)
          };

          await CreateProductionOrderUseCase.execute(dto);
          decision.reason += ' | OP successfully created';
        } catch (error: any) {
          console.error(`[ProcessTrelloWebhookUseCase] Error creating OP for card ${decision.cardId}:`, error);
          decision.reason += ` | Error creating OP: ${error.message}`;
        }
      } else {
        decision.reason += ' | Card name/description could not be parsed, OP not created';
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

