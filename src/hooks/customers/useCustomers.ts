import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { saveCustomer as saveUseCase } from '../../features/customers/usecases/SaveCustomer';
import { deleteCustomer as deleteUseCase } from '../../features/customers/usecases/DeleteCustomer';
import { CustomersRepository } from '../../features/customers/infra/CustomersRepository';
import { useToast } from '../../components/ui/Toast';
import { type CustomerInput } from '../../features/customers/infra/CustomerSchemas';
import { type Customer } from '../../db/models';

export function useCustomers() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: customers = [], isLoading: isQueryLoading } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const result = await CustomersRepository.getAll();
      if (!result.success || !result.data) return [];
      return result.data;
    }
  });

  const isLoading = isQueryLoading || isSyncing;

  const fetchCustomers = useCallback(async () => {
    setIsSyncing(true);
    await queryClient.invalidateQueries({ queryKey: ['customers'] });
    setIsSyncing(false);
  }, [queryClient]);

  const syncWithOmie = async () => {
    setIsSyncing(true);
    const res = await CustomersRepository.syncWithOmie();
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      toastSuccess('Sincronização com Omie concluída');
    } else {
      toastError(res.error || 'Erro ao sincronizar');
    }
    setIsSyncing(false);
  };

  const saveCustomer = async (input: CustomerInput) => {
    const res = await saveUseCase(input);
    if (res.success) {
      toastSuccess('Cliente salvo com sucesso');
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    } else {
      toastError(res.error || 'Erro ao salvar cliente');
    }
    return res;
  };

  const deleteCustomer = async (id: string) => {
    const res = await deleteUseCase(id);
    if (res.success) {
      toastSuccess('Cliente removido com sucesso');
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    } else {
      toastError(res.error || 'Erro ao remover cliente');
    }
    return res;
  };

  return {
    customers,
    isLoading,
    isSyncing,
    syncWithOmie,
    saveCustomer,
    deleteCustomer,
    refreshCustomers: fetchCustomers
  };
}
