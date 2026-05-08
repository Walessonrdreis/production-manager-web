import { Order, OrdersRepository } from '../index';
import { findOrdersArray, normalizeOrder } from '../domain/OrderNormalizer';
import { Result } from '../../../lib/Result';
import { validateOmieOrders } from '../infra/OrderSchemas';
import { enrichOrdersWithLocalCustomers } from '../../customers/domain/CustomerEnricher';

/**
 * UseCase: Busca e normaliza a lista de ordens de venda (pedidos).
 * Pilar 1: Result Pattern.
 * Pilar 3: Zod-First na Infra (validado aqui no usecase antes do normalizer).
 */
export async function getOrders(): Promise<Result<Order[]>> {
  try {
    const response = await OrdersRepository.getAll();
    const res = response.data;
    
    const rawOrders = findOrdersArray(res) || [];
    
    // Validação com Zod
    const validation = validateOmieOrders(rawOrders);
    
    // Usamos os dados validados (com transforms e defaults do Zod) se sucesso, 
    // caso contrário usamos os brutos como fallback para o normalizer tentar a sorte
    const dataToNormalize = validation.success ? validation.data : rawOrders;

    if (!validation.success) {
      console.warn('Dados da API Omie (Pedidos) fora do padrão esperado:', validation.error);
    }

    const baseOrders = dataToNormalize.map(normalizeOrder);

    // Enriquecimento com dados locais de clientes
    const enrichedOrders = await enrichOrdersWithLocalCustomers(baseOrders);

    return Result.ok(enrichedOrders);
  } catch (err) {
    return Result.fail(err instanceof Error ? err.message : 'Erro ao carregar pedidos da Omie.');
  }
}
