import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import events from 'events';
import { proxyRouter } from './apps/api/src/modules/proxy/presentation/http/routes.js';

// Carrega variáveis de ambiente do .env
dotenv.config();

// Aumenta o limite global de ouvintes para evitar "MaxListenersExceededWarning" no TLSSocket
events.EventEmitter.defaultMaxListeners = 100;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Aumenta o limite global de ouvintes
  process.setMaxListeners(100);

  // Body parser
  app.use(express.json());

  // Use the extracted proxy module
  app.use('/api/proxy', proxyRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
