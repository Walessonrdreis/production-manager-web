import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app/App.tsx';
import './styles/global.css';
import { initSyncService } from './sync/produced.sync';

async function prepareApp() {
  initSyncService();
  const env = (import.meta as any).env;
  if (env?.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});