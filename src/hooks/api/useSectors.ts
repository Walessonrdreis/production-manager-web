import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sector } from '../../types/api';
import { 
  getSectors, 
  createSector, 
  updateSector, 
  deleteSector 
} from '../../features/sectors';

export function useSectors() {
  const queryClient = useQueryClient();

  const sectorsQuery = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
  });

  const createMutation = useMutation({
    mutationFn: createSector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, sector }: { id: string, sector: Partial<Sector> }) => 
      updateSector(id, sector),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });

  return {
    sectors: sectorsQuery.data || [],
    isLoading: sectorsQuery.isLoading,
    isError: sectorsQuery.isError,
    error: sectorsQuery.error,
    createSector: createMutation,
    updateSector: updateMutation,
    deleteSector: deleteMutation,
  };
}
