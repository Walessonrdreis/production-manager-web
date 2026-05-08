import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSector } from '../../features/sectors';
import { useToast } from '../../components/ui/Toast';
import { Result } from '../../lib/Result';

export function useCreateSector() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: createSector,
    onMutate: async (newSector) => {
      // Cancela refetches em andamento para não sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey: ['sectors'] });

      // Snapshot do valor anterior
      const previousSectors = queryClient.getQueryData<Result<any[]>>(['sectors']);

      // Update otimista no cache
      if (previousSectors?.success) {
        queryClient.setQueryData(['sectors'], {
          ...previousSectors,
          data: [...previousSectors.data, { ...newSector, id: 'temp-' + Date.now() }]
        });
      }

      return { previousSectors };
    },
    onSuccess: (result) => {
      if (result.success) {
        success('Setor criado com sucesso.');
      } else {
        error(result.error);
      }
    },
    onError: (err, _newSector, context) => {
      // Rollback em caso de erro
      if (context?.previousSectors) {
        queryClient.setQueryData(['sectors'], context.previousSectors);
      }
      error(err instanceof Error ? err.message : 'Erro ao criar setor');
    },
    onSettled: () => {
      // Invalida para garantir sincronia com os dados reais do servidor
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    }
  });
}
