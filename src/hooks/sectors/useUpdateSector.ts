import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSector } from '../../features/sectors';
import { Sector } from '../../types/api';

export function useUpdateSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sector }: { id: string, sector: Partial<Sector> }) => 
      updateSector(id, sector),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}
