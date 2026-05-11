import { type ProducedRecord } from '../../../db/models';

export const ProductionLogic = {
  /**
   * Calcula a ação necessária para o "Toggle All" baseado no estado atual.
   * Retorna os IDs a serem removidos e, opcionalmente, um novo registro a ser criado.
   */
  calculateToggleAllByOrdersAction(
    description: string,
    orders: any[],
    currentRecords: ProducedRecord[]
  ): { idsToDelete: string[]; recordsToAdd: Omit<ProducedRecord, 'updatedAt' | 'synced'>[] } {
     const expectedIds = orders.map(o => `order-${o.id}-${description}`);
     const existingIds = expectedIds.filter(id => currentRecords.some(r => r.id === id));
     
     if (existingIds.length === expectedIds.length && expectedIds.length > 0) {
        return { idsToDelete: existingIds, recordsToAdd: [] };
     } else {
        const missingOrders = orders.filter(o => !currentRecords.some(r => r.id === `order-${o.id}-${description}`));
        const recordsToAdd = missingOrders.map(o => ({
              id: `order-${o.id}-${description}`,
              description,
              quantity: o.items?.find((i: any) => i.description === description)?.quantity || o.itemQuantity || 0,
              orderId: String(o.id),
              orderNumber: String(o.numero_pedido || o.orderNumber || o.id)
        }));
        return { idsToDelete: [], recordsToAdd };
     }
  },

  /**
   * Decide se um registro deve ser criado ou removido ao alternar um único item.
   */
  calculateToggleAction(
    exists: boolean,
    params: { id: string; description: string; quantity: number; orderId?: string; orderNumber?: string }
  ): { action: 'create' | 'delete'; record?: Omit<ProducedRecord, 'updatedAt' | 'synced'> } {
    if (exists) {
      return { action: 'delete' };
    }
    return {
      action: 'create',
      record: {
        id: params.id,
        description: params.description,
        quantity: params.quantity,
        orderId: params.orderId,
        orderNumber: params.orderNumber
      }
    };
  }
};
