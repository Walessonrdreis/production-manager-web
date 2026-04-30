import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { saveCustomer as saveUseCase } from '../../features/customers/usecases/SaveCustomer';
import { deleteCustomer as deleteUseCase } from '../../features/customers/usecases/DeleteCustomer';
import { useToast } from '../../components/ui/Toast';
import { type CustomerInput } from '../../features/customers/infra/CustomerSchemas';

export function useCustomers() {
  const { success: toastSuccess, error: toastError } = useToast();
  
  const customers = useLiveQuery(() => db.customers.toArray()) || [];
  const isLoading = customers === undefined;

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
    saveCustomer,
    deleteCustomer,
  };
}
