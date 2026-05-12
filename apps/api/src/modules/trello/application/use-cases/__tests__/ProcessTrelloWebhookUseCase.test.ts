import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessTrelloWebhookUseCase } from '../ProcessTrelloWebhookUseCase.js';
import { CreateProductionOrderUseCase } from '../../../../production-orders/application/use-cases/CreateProductionOrderUseCase.js';

// Mock global do caso de uso de OP para não acessar Firestore nem regras externas
vi.mock('../../../../production-orders/application/use-cases/CreateProductionOrderUseCase.js', () => ({
  CreateProductionOrderUseCase: {
    execute: vi.fn(),
  },
}));

describe('ProcessTrelloWebhookUseCase', () => {
  let useCase: ProcessTrelloWebhookUseCase;

  const TARGET_LIST_ID = '672a2824e7f42ce048d73ead';
  const OTHER_LIST_ID = 'other-list-123';

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ProcessTrelloWebhookUseCase();
  });

  it('deve chamar CreateProductionOrderUseCase quando evento for createCard na lista correta', async () => {
    const payload = {
      action: {
        type: 'createCard',
        data: {
          list: { id: TARGET_LIST_ID },
          card: { id: 'card123', name: 'Porta - COD1 - LOTE1 - 10 un' }
        }
      }
    };

    const result = await useCase.execute(payload);

    expect(result.shouldCreateProductionOrder).toBe(true);
    expect(CreateProductionOrderUseCase.execute).toHaveBeenCalledTimes(1);
    expect(CreateProductionOrderUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
      lote: 'LOTE1',
      quantity: 10,
      productCode: 'COD1',
      source: 'TRELLO',
      trelloCardId: 'card123'
    }));
  });

  it('deve chamar CreateProductionOrderUseCase quando evento for copyCard na lista correta', async () => {
    const payload = {
      action: {
        type: 'copyCard',
        data: {
          list: { id: TARGET_LIST_ID },
          card: { id: 'card124', name: 'Mesa - LOTE2 - 5 un' } 
        }
      }
    };

    const result = await useCase.execute(payload);

    expect(result.shouldCreateProductionOrder).toBe(true);
    expect(CreateProductionOrderUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('deve chamar CreateProductionOrderUseCase quando evento for updateCard movendo para a lista correta', async () => {
    const payload = {
      action: {
        type: 'updateCard',
        data: {
          listAfter: { id: TARGET_LIST_ID },
          listBefore: { id: OTHER_LIST_ID },
          card: { id: 'card125', name: 'Cadeira - LOTE3 - 20 un' }
        }
      }
    };

    const result = await useCase.execute(payload);

    expect(result.shouldCreateProductionOrder).toBe(true);
    expect(CreateProductionOrderUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('NAO deve chamar CreateProductionOrderUseCase quando evento for updateCard apenas editando dados', async () => {
    const payload = {
      action: {
        type: 'updateCard',
        data: {
          old: { name: 'Old name' },
          card: { id: 'card126', name: 'Cadeira - LOTE3 - 20 un' } 
        }
      }
    };

    const result = await useCase.execute(payload);

    // Como o cartão não foi movido de lista, a decisão de injetar deve abortar
    expect(result.shouldCreateProductionOrder).toBe(false);
    expect(result.reason).toContain('not moved');
    expect(CreateProductionOrderUseCase.execute).not.toHaveBeenCalled();
  });

  it('NAO deve chamar CreateProductionOrderUseCase se o card não puder ser parseado (nome inválido)', async () => {
    const payload = {
      action: {
        type: 'createCard',
        data: {
          list: { id: TARGET_LIST_ID },
          card: { id: 'card127', name: 'Nome de card invalido sem lote e qtd' } 
        }
      }
    };

    const result = await useCase.execute(payload);

    // O trigger permitiu, mas o parser rejeitou, logo não deve chamar o execute
    expect(result.shouldCreateProductionOrder).toBe(true);
    expect(result.reason).toContain('could not be parsed');
    expect(CreateProductionOrderUseCase.execute).not.toHaveBeenCalled();
  });

  it('deve absorver erros do CreateProductionOrderUseCase sem quebrar o webhook (ex: idempotência, OP já existe)', async () => {
    // Simulamos o CreateProductionOrderUseCase rejeitando por duplicação (idempotência)
    vi.mocked(CreateProductionOrderUseCase.execute).mockRejectedValueOnce(new Error('OP already exists'));

    const payload = {
      action: {
        type: 'createCard',
        data: {
          list: { id: TARGET_LIST_ID },
          card: { id: 'card128', name: 'Vidro - COD9 - LOTE9 - 99 un' } 
        }
      }
    };

    const result = await useCase.execute(payload);

    expect(result.shouldCreateProductionOrder).toBe(true);
    expect(CreateProductionOrderUseCase.execute).toHaveBeenCalledTimes(1);
    
    // Mostra que a execução chegou até o fim e salvou o erro do log
    expect(result.reason).toContain('Error creating OP: OP already exists');
  });
});
