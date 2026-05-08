import { ProductionLogic } from '../domain/ProductionLogic';
import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Alterna a seleção de um registro de produção por pedido.
 * Verifica a existência atual, aplica lógica de domínio e persiste criação ou deleção.
 */
export async function toggleProducedOrder(
  id: string, 
  description: string, 
  quantity: number, 
  orderId?: string, 
  orderNumber?: string
): Promise<Result<any>> {
  try {
    const existing = await ProducedRepository.getById(id);
    
    const { action, record } = ProductionLogic.calculateToggleAction(!!existing, {
      id,
      description,
      quantity,
      orderId,
      orderNumber
    });

    if (action === 'delete') {
      await ProducedRepository.delete(id);
      return Result.ok(null);
    } else if (record) {
      const saved = await ProducedRepository.save(record);
      return Result.ok(saved);
    }
    
    return Result.ok(null);
  } catch (err) {
    return Result.fail('Erro ao alternar registro de produção.');
  }
}
