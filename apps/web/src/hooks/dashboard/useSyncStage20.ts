import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncProduction as syncProductionUseCase } from '../../features/production';
import { useToast } from '../../components/ui/Toast';

export function useSyncStage20() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: syncProductionUseCase,
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
