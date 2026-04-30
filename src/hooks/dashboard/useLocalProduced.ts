import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { 
  toggleProducedOrder, 
  toggleAllProduced, 
  removeLocalProduced 
} from '../../features/dashboard';
import { useToast } from '../../components/ui/Toast';

export function useLocalProduced() {
  const { success, error } = useToast();
  const producedRecords = useLiveQuery(() => db.produced.toArray());

  const toggleOrder = async (id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) => {
    const res = await toggleProducedOrder(id, description, quantity, orderId, orderNumber);
    if (!res.success) error(res.error);
    return res;
  };

  const toggleAll = async (description: string, totalNeeded: number) => {
    const res = await toggleAllProduced(description, totalNeeded);
    if (!res.success) error(res.error);
    return res;
  };

  const deleteProduced = async (id: string) => {
    const res = await removeLocalProduced(id);
    if (!res.success) {
      error(res.error);
    } else {
      success('Registro de produção removido.');
    }
    return res;
  };

  return {
    producedRecords: producedRecords || [],
    isLoading: producedRecords === undefined,
    toggleOrder,
    toggleAll,
    deleteProduced
  };
}
