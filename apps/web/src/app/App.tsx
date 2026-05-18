import React from 'react';
import { AppProviders } from './Providers';
import { AppRouter } from './Router';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ThemeProvider>
  );
}
