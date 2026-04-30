import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { 
  toggleProducedOrder, 
  toggleAllProduced, 
  removeLocalProduced 
} from '../../features/dashboard';

export function useLocalProduced() {
  const producedRecords = useLiveQuery(() => db.produced.toArray());

  const toggleOrder = async (id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) => {
    return await toggleProducedOrder(id, description, quantity, orderId, orderNumber);
  };

  const toggleAll = async (description: string, totalNeeded: number) => {
    return await toggleAllProduced(description, totalNeeded);
  };

  const deleteProduced = async (id: string) => {
    await removeLocalProduced(id);
  };

  return {
    producedRecords: producedRecords || [],
    isLoading: producedRecords === undefined,
    toggleOrder,
    toggleAll,
    deleteProduced
  };
}
