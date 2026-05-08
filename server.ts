import { setupEnv } from './apps/api/src/config/env.js';
import { startServer } from './apps/api/src/bootstrap/server.js';

// Inicializa variáveis de ambiente e configurações globais
setupEnv();

// Inicia o servidor HTTP, o express configurado, módulos API, Vite middlewares (em dev) ou estáticos (em prod)
startServer().catch((err) => {
  console.error('[FATAL] Failed to start server:', err);
  process.exit(1);
});
