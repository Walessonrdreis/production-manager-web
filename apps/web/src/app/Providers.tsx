import React from 'react';
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ErrorBoundary } from './ErrorBoundary';

// Query Client Configuration
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('[React Query] Query Error:', {
        queryKey: query.queryKey,
        error
      });
      // Apenas mostra toast se a query não estiver lidando com o erro ativamente
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.error('[React Query] Mutation Error:', {
        mutationKey: mutation.options.mutationKey,
        variables,
        error
      });
      // Mostra toast para mutações (são ações do usuário)
      toast.error('Ocorreu um erro ao processar sua solicitação', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'PROD_MANAGER_QUERY_CACHE',
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <PersistQueryClientProvider 
        client={queryClient} 
        persistOptions={{ 
          persister,
          maxAge: 1000 * 60 * 60 * 24,
        }}
      >
        <BrowserRouter>
          {children}
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
}
