import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { saveCustomer as saveUseCase } from '../../features/customers/usecases/SaveCustomer';
import { deleteCustomer as deleteUseCase } from '../../features/customers/usecases/DeleteCustomer';
import { CustomersRepository } from '../../features/customers/infra/CustomersRepository';
import { useToast } from '../../components/ui/Toast';
import { type CustomerInput } from '../../features/customers/infra/CustomerSchemas';

export function useCustomers() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const customers = useLiveQuery(() => db.customers.toArray()) || [];
  const isLoading = customers === undefined || isSyncing;

  const fetchCustomers = async () => {
    setIsSyncing(true);
    await CustomersRepository.getAll();
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const syncWithOmie = async () => {
    setIsSyncing(true);
    const res = await CustomersRepository.syncWithOmie();
    if (res.success) {
      await CustomersRepository.getAll();
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
    } else {
      toastError(res.error || 'Erro ao salvar cliente');
    }
    return res;
  };

  const deleteCustomer = async (id: string) => {
    const res = await deleteUseCase(id);
    if (res.success) {
      toastSuccess('Cliente removido com sucesso');
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
