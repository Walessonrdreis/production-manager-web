import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductionSchedules, setProductionSchedule, removeProductionSchedule } from '../../features/production';
import { useToast } from '../../components/ui/Toast';

export function useProductionSchedules() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const query = useQuery({
    queryKey: ['production-schedules'],
    queryFn: async () => {
      const res = await getProductionSchedules();
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: ({ description, date, notes }: { description: string; date: string; notes?: string }) => 
      setProductionSchedule(description, date, notes),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['production-schedules'] });
        success('Programação salva com sucesso.');
      } else {
        showError(res.error);
      }
    }
  });

  const removeMutation = useMutation({
    mutationFn: (description: string) => removeProductionSchedule(description),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['production-schedules'] });
        success('Programação removida.');
      } else {
        showError(res.error);
      }
    }
  });

  return {
    schedules: query.data || [],
    isLoading: query.isLoading,
    setSchedule: mutation.mutate,
    isSetting: mutation.isPending,
    removeSchedule: removeMutation.mutate,
    isRemoving: removeMutation.isPending
  };
}
