import React from 'react';
import { AppProviders } from './Providers';
import { AppRouter } from './Router';

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
