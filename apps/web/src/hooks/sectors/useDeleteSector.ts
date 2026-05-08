import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSector } from '../../features/sectors';
import { useToast } from '../../components/ui/Toast';
import { Result } from '../../lib/Result';

export function useDeleteSector() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: deleteSector,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['sectors'] });
      const previousSectors = queryClient.getQueryData<Result<any[]>>(['sectors']);

      if (previousSectors?.success) {
        queryClient.setQueryData(['sectors'], {
          ...previousSectors,
          data: previousSectors.data.filter(s => s.id !== id)
        });
      }

      return { previousSectors };
    },
    onSuccess: (result) => {
      if (result.success) {
        success('Setor excluído com sucesso.');
      } else {
        error(result.error);
      }
    },
    onError: (err, _id, context) => {
      if (context?.previousSectors) {
        queryClient.setQueryData(['sectors'], context.previousSectors);
      }
      error(err instanceof Error ? err.message : 'Erro ao excluir setor');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    }
  });
}
