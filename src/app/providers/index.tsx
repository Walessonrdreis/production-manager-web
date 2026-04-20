import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '../../shared/lib/query-client';
import { ToastContainer } from '../../shared/ui/Toast';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

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
          maxAge: 1000 * 60 * 60 * 24, // 24 horas de validade máxima para persistência
        }}
      >
        <BrowserRouter>
          {children}
        </BrowserRouter>
        <ToastContainer />
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
}
