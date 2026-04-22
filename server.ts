import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Caminho para o banco local de desenvolvimento
const DB_PATH = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { sectors: [], planning: [] };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Criamos um agente HTTPS persistente para reutilizar conexões e evitar o aviso de MaxListeners
const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 60000
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
const app = express();
const PORT = 3000;

// Aumenta o limite global de ouvintes para evitar o aviso de memory leak em situações de alta concorrência
process.setMaxListeners(20);

// Body parser for proxy POST/PUT requests
  app.use(express.json());

  // Generic Proxy Route for Production Manager API
  // This bypasses browser CORS restrictions for ALL v1 endpoints
  app.use('/api/proxy', async (req, res, next) => {
    // Se o caminho for vazio ou não começar com /, ignoramos (deve ser tratado pelo next/vite)
    if (req.url === '/' && req.path === '/') return next();

    try {
      const targetPath = req.path.startsWith('/') ? req.path.slice(1) : req.path;
      
      // INTERCEPTAÇÃO PARA BANCO LOCAL EM DESENVOLVIMENTO (Sectors e Planning)
      if (targetPath === 'sectors' || targetPath.startsWith('sectors/') || 
          targetPath === 'planning' || targetPath.startsWith('planning/')) {
        
        const db = await readDb();
        const collection = targetPath.startsWith('sectors') ? 'sectors' : 'planning';
        const parts = targetPath.split('/');
        const id = parts.length > 1 ? parts[1] : null;

        if (req.method === 'GET') {
          if (id) {
            const item = db[collection].find((i: any) => i.id === id);
            return item ? res.json(item) : res.status(404).json({ error: 'Not found' });
          }
          return res.json(db[collection]);
        }

        if (req.method === 'POST') {
          const newItem = { ...req.body, id: randomUUID(), createdAt: new Date().toISOString() };
          db[collection].push(newItem);
          await writeDb(db);
          return res.status(201).json(newItem);
        }

        if (req.method === 'PATCH' || req.method === 'PUT') {
          if (!id) return res.status(400).json({ error: 'ID required' });
          const index = db[collection].findIndex((i: any) => i.id === id);
          if (index === -1) return res.status(404).json({ error: 'Not found' });
          
          db[collection][index] = { ...db[collection][index], ...req.body, updatedAt: new Date().toISOString() };
          await writeDb(db);
          return res.json(db[collection][index]);
        }

        if (req.method === 'DELETE') {
          if (!id) return res.status(400).json({ error: 'ID required' });
          db[collection] = db[collection].filter((i: any) => i.id !== id);
          await writeDb(db);
          return res.status(204).send();
        }
      }

      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      
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
        timeout: 60000,
        httpsAgent: httpsAgent
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error(`[PROXY ERROR] ${req.url}:`, error.message);
      
      // Se for um erro da API de destino, repassamos o status e o erro
      if (error.response) {
        console.error(`[PROXY ERROR DETAIL]`, error.response.data);
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
