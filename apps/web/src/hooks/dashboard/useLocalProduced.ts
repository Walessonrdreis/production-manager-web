import { useQuery } from '@tanstack/react-query';
import { 
  toggleProducedOrder, 
  toggleAllProduction, 
  removeLocalProduced,
  ProducedRepository
} from '../../features/production';
import { useToast } from '../../components/ui/Toast';

export function useLocalProduced() {
  const { success, error } = useToast();
  
  const { data: producedRecords = [], isLoading, refetch } = useQuery({
    queryKey: ['producedRecords'],
    queryFn: () => ProducedRepository.getAll()
  });

  const toggleOrder = async (id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) => {
    const res = await toggleProducedOrder(id, description, quantity, orderId, orderNumber);
    if (!res.success) error(res.error);
    await refetch();
    return res;
  };

  const toggleAll = async (description: string, totalNeeded: number) => {
    const res = await toggleAllProduction(description, totalNeeded);
    if (!res.success) error(res.error);
    await refetch();
    return res;
  };

  const deleteProduced = async (id: string) => {
    const res = await removeLocalProduced(id);
    if (!res.success) {
      error(res.error);
    } else {
      success('Registro de produção removido.');
    }
    await refetch();
    return res;
  };

  return {
    producedRecords,
    isLoading,
    toggleOrder,
    toggleAll,
    deleteProduced
  };
}
