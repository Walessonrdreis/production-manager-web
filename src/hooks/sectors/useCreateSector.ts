import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSector } from '../../features/sectors';

export function useCreateSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}
