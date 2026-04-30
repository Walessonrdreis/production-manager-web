import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncStage20 as syncStage20UseCase } from '../../features/dashboard';
import { useToast } from '../../components/ui/Toast';

export function useSyncStage20() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: syncStage20UseCase,
    onSuccess: (result) => {
      if (result.success) {
        success('Sincronização concluída.', `Foram atualizados ${result.data.count} itens.`);
        queryClient.invalidateQueries({ queryKey: ['stage20-totals'] });
      } else {
        error(result.error);
      }
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : 'Erro na sincronização');
    }
  });
}
