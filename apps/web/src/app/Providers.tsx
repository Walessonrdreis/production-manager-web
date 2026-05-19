import React from 'react';
import { QueryClient, QueryCache, MutationCache, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { HashRouter } from 'react-router-dom';
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

const getSafeStorage = (): Storage | undefined => {
  try {
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn('LocalStorage is not available (likely iframe restrictions). Persistance disabled.');
    return undefined;
  }
};

const storage = getSafeStorage();

const persister = storage ? createSyncStoragePersister({
  storage,
  key: 'PROD_MANAGER_QUERY_CACHE',
}) : undefined;

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      {persister ? (
        <PersistQueryClientProvider 
          client={queryClient} 
          persistOptions={{ 
            persister,
            maxAge: 1000 * 60 * 60 * 24,
          }}
        >
          <HashRouter>
            {children}
          </HashRouter>
          <Toaster position="top-right" richColors closeButton />
        </PersistQueryClientProvider>
      ) : (
        // Fallback when persistence is unavailable
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            {children}
          </HashRouter>
          <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
      )}
    </ErrorBoundary>
  );
}
