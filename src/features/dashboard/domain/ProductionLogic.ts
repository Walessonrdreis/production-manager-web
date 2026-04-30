import { type ProducedRecord } from '../../../db/models';

export const ProductionLogic = {
  /**
   * Calcula a ação necessária para o "Toggle All" baseado no estado atual.
   * Retorna os IDs a serem removidos e, opcionalmente, um novo registro a ser criado.
   */
  calculateToggleAllAction(
    description: string,
    totalNeeded: number,
    currentRecords: ProducedRecord[]
  ): { idsToDelete: string[]; recordToAdd: Omit<ProducedRecord, 'updatedAt' | 'synced'> | null } {
    const currentTotal = currentRecords.reduce((acc, r) => acc + r.quantity, 0);
    const idsToDelete = currentRecords.map(r => r.id);

    // Se já produziu tudo ou mais, a intenção do "Toggle All" é limpar/desmarcar tudo
    if (currentTotal >= totalNeeded) {
      return {
        idsToDelete,
        recordToAdd: null
      };
    }

    // Caso contrário, remove as parciais e cria um registro consolidado
    return {
      idsToDelete,
      recordToAdd: {
        id: `all-${description}`,
        description,
        quantity: totalNeeded
      }
    };
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
