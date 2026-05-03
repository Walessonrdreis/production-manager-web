import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncSectors } from '../../features/sectors/usecases/SyncSectors';
import { useToast } from '../../components/ui/Toast';

export function useSyncSectors() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: syncSectors,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['sectors'] });
        addToast({
          title: 'Sincronização Concluída',
          message: 'Setores atualizados com a API.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Falha na Sincronização',
          message: result.error,
          type: 'error',
        });
      }
    },
    onError: (error: any) => {
      addToast({
        title: 'Erro de Conexão',
        message: error.message || 'Não foi possível conectar ao servidor.',
        type: 'error',
      });
    },
  });
}
