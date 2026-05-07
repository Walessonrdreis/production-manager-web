import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente do .env
dotenv.config();

// Criamos um agente HTTPS persistente
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

  // Aumenta o limite global de ouvintes
  process.setMaxListeners(100);

  // Body parser
  app.use(express.json());

  // Middle-ware de Log para o Proxy
  app.use('/api/proxy', async (req, res, next) => {
    // Normaliza o path para comparação
    const rawPath = req.path.replace(/^\/|\/$/g, '');
    const targetPath = rawPath.toLowerCase();

    console.log(`[PROXY] ${req.method} ${rawPath}`);

    if (req.url === '/' && req.path === '/') return next();

    // Endpoints locais agora são totalmente tratados via Firebase no client
    // Porém, para sync com Omie, ainda usamos o proxy para bypass de CORS

    // SYNC PRODUCTS
    if (req.method === 'POST' && targetPath === 'admin/omie/sync/products') {
      console.log('[SYNC] Products Sync triggered via Proxy');
      try {
        const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
        const response = await axios.get(targetUrl, { 
          timeout: 60000, 
          params: { limit: 1000 },
          httpsAgent: httpsAgent 
        });
        
        const products = response.data.data || [];
        return res.json({ success: true, count: products.length, data: products });
      } catch (err: any) {
        console.error('[SYNC PRODUCTS ERROR]', err.message);
        return res.status(500).json({ error: 'Sync failed', message: err.message });
      }
    }

    // SYNC ORDERS (STAGE 20)
    if (req.method === 'POST' && targetPath === 'admin/omie/orders/stage20/sync') {
      console.log('[SYNC] Orders Sync triggered via Proxy');
      try {
        const targetUrl = `https://production-manager-api.onrender.com/v1/orders`;
        const response = await axios.get(targetUrl, { 
          timeout: 60000, 
          params: { page: 1, pageSize: 500 },
          httpsAgent: httpsAgent 
        });
        
        const responseData = response.data || {};
        const orders = responseData.orders || [];
        
        // Formatar e retornar, cliente salva no Firebase
        const formattedOrders = orders.map((raw: any) => {
          const o = raw.order || {};
          const c = raw.client || {};
          const id = o.omieCode || raw.omieCode || raw.id;
          const totalValue = Array.isArray(raw.items) 
            ? raw.items.reduce((acc: number, cur: any) => acc + (Number(cur.totalPrice) || 0), 0)
            : 0;
            
          return {
            id,
            order_number: o.orderNumber || raw.numeroPedido || raw.order_number || id,
            customer_name: c.tradeName || c.legalName || raw.customerName || 'N/A',
            customer_id: c.omieClientCode || raw.customerId || raw.customer_id || null,
            status: o.stage || raw.etapa || raw.status || '20',
            total_value: totalValue || raw.total_value || 0,
            items: raw.items || [],
            created_at: o.expectedDate || raw.created_at || new Date().toISOString(),
            updated_at: raw.lastSyncAt || raw.updated_at || new Date().toISOString()
          };
        });

        return res.json({ success: true, count: formattedOrders.length, data: formattedOrders });
      } catch (err: any) {
        console.error('[SYNC ORDERS ERROR]', err.message);
        return res.status(500).json({ error: 'Sync failed', message: err.message });
      }
    }

    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      
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
