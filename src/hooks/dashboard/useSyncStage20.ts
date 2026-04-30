import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncStage20 as syncStage20UseCase } from '../../features/dashboard';

export function useSyncStage20() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncStage20UseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stage20-totals'] });
    },
  });
}
