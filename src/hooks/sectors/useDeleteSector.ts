import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSector } from '../../features/sectors';

export function useDeleteSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}
