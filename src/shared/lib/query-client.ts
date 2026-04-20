import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutos (conforme solicitado)
      gcTime: 1000 * 60 * 60 * 24, // Manter no cache por 24h mesmo se "stale"
      retry: 1,
      refetchOnWindowFocus: false, // Evita requisição ao trocar de aba se os dados ainda são válidos
    },
  },
});
