import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { Sector } from '../../types/api';

export function useSectors() {
  const queryClient = useQueryClient();

  const sectorsQuery = useQuery({
    queryKey: ['sectors'],
    queryFn: async (): Promise<Sector[]> => {
      const response = await apiClient.get(ENDPOINTS.SECTORS.BASE);
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data.sectors && Array.isArray(data.sectors)) return data.sectors;
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (sector: Omit<Sector, 'id'>) => {
      const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, sector }: { id: string, sector: Partial<Sector> }) => {
      const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
    },
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
