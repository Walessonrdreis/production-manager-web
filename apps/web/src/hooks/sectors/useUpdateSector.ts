import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSector } from '../../features/sectors';
import { Sector } from '../../types/api';
import { useToast } from '../../components/ui/Toast';
import { Result } from '../../lib/Result';

export function useUpdateSector() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, sector }: { id: string, sector: Partial<Sector> }) => 
      updateSector(id, sector),
    onMutate: async ({ id, sector }) => {
      await queryClient.cancelQueries({ queryKey: ['sectors'] });
      const previousSectors = queryClient.getQueryData<Result<any[]>>(['sectors']);

      if (previousSectors?.success) {
        queryClient.setQueryData(['sectors'], {
          ...previousSectors,
          data: previousSectors.data.map(s => s.id === id ? { ...s, ...sector } : s)
        });
      }

      return { previousSectors };
    },
    onSuccess: (result) => {
      if (result.success) {
        success('Setor atualizado com sucesso.');
      } else {
        error(result.error);
      }
    },
    onError: (err, _vars, context) => {
      if (context?.previousSectors) {
        queryClient.setQueryData(['sectors'], context.previousSectors);
      }
      error(err instanceof Error ? err.message : 'Erro ao atualizar setor');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    }
  });
}
