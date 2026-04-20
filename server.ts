import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for proxy POST/PUT requests
  app.use(express.json());

  // Generic Proxy Route for Production Manager API
  // This bypasses browser CORS restrictions for ALL v1 endpoints
  app.use('/api/proxy', async (req, res, next) => {
    // Se o caminho for vazio ou não começar com /, ignoramos (deve ser tratado pelo next/vite)
    if (req.url === '/' && req.path === '/') return next();

    try {
      // Usamos req.path para obter apenas a rota sem a query string (que é enviada via 'params')
      const targetPath = req.path.startsWith('/') ? req.path.slice(1) : req.path;
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      
      console.log(`[PROXY] ${req.method} ${req.path} -> ${targetUrl}`);
      
      // Encaminhamos o cabeçalho de autorização se presente
      const headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: headers,
        timeout: 10000 
      });
      
      console.log(`[PROXY SUCCESS] ${targetUrl} - Status: ${response.status}`);
      res.json(response.data);
    } catch (error: any) {
      console.error(`[PROXY ERROR] ${req.url}:`, error.message);
      
      // Se for um erro da API de destino, repassamos o status e o erro
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      
      res.status(500).json({
        error: 'Proxy request failed',
        message: error.message
      });
    }
  });

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
