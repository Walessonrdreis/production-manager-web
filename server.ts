import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Caminhos para o banco local de desenvolvimento
const DB_PATH = path.join(process.cwd(), 'db.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Estado global para o banco em memória (Melhora a velocidade drasticamente)
let memoryDb: any = null;
let isWriting = false;
let writePending = false;

// Função para garantir que o diretório de backups exista
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

async function createBackup() {
  if (!memoryDb) return;
  await ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const backupPath = path.join(BACKUP_DIR, `db_backup_${timestamp}.json`);
  await fs.writeFile(backupPath, JSON.stringify(memoryDb, null, 2));
  
  // Opcional: Manter apenas os últimos 10 backups para não encher o disco
  const files = await fs.readdir(BACKUP_DIR);
  if (files.length > 10) {
    const sorted = files.sort();
    for (let i = 0; i < sorted.length - 10; i++) {
      await fs.unlink(path.join(BACKUP_DIR, sorted[i]));
    }
  }
}

async function readDb() {
  if (memoryDb) return memoryDb;
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    memoryDb = JSON.parse(data);
    return memoryDb;
  } catch (error) {
    memoryDb = { sectors: [], planning: [], dashboard_produced: [] };
    return memoryDb;
  }
}

async function persistDb() {
  if (isWriting) {
    writePending = true;
    return;
  }
  isWriting = true;
  try {
    // Escrita atômica: salva num temporário e renomeia
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(memoryDb, null, 2));
    await fs.rename(tempPath, DB_PATH);
    await createBackup();
  } catch (err) {
    console.error('Erro ao persistir banco de dados:', err);
  } finally {
    isWriting = false;
    if (writePending) {
      writePending = false;
      persistDb();
    }
  }
}

async function writeDb(data: any) {
  memoryDb = data;
  // Não "aguardamos" o disco para responder ao cliente (Performance!)
  persistDb();
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
      
      // INTERCEPTAÇÃO PARA BANCO LOCAL EM DESENVOLVIMENTO (Planning e Dashboard Produced)
      if (targetPath === 'planning' || targetPath.startsWith('planning/') ||
          targetPath === 'dashboard/produced' || targetPath.startsWith('dashboard/produced/')) {
        
        const db = await readDb();
        let collection = 'planning';
        if (targetPath.startsWith('dashboard/produced')) collection = 'dashboard_produced';

        const parts = targetPath.split('/');
        const id = parts.length > 1 ? (parts[0] === 'dashboard' ? parts[2] : parts[1]) : null;

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
      console.log(`[PROXY] ${req.method} ${req.url} -> ${targetUrl}`);
      
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
