import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { ProducedRepository } from '../../repositories/produced.repo';

export function useLocalProduced() {
  const producedRecords = useLiveQuery(() => db.produced.toArray());

  const toggleOrder = async (id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) => {
    return await ProducedRepository.toggleOrder(id, description, quantity, orderId, orderNumber);
  };

  const toggleAll = async (description: string, totalNeeded: number) => {
    return await ProducedRepository.toggleAll(description, totalNeeded);
  };

  const deleteProduced = async (id: string) => {
    await ProducedRepository.delete(id);
  };

  return {
    producedRecords: producedRecords || [],
    isLoading: producedRecords === undefined,
    toggleOrder,
    toggleAll,
    deleteProduced
  };
}