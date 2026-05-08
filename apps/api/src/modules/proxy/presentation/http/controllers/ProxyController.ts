import { Request, Response } from 'express';
import axios from 'axios';
import https from 'https';

// Criamos um agente HTTPS persistente
const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 60000
});
httpsAgent.setMaxListeners(100);

// Proxy methods from server.ts
export class ProxyController {
  
  static async syncProducts(req: Request, res: Response) {
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

  static async syncOrders(req: Request, res: Response) {
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

  static async syncClients(req: Request, res: Response) {
    console.log('[SYNC] Clients Sync triggered via Proxy');
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/clients`;
      const response = await axios.get(targetUrl, { 
        timeout: 120000, 
        params: { page: 1, pageSize: 5000 },
        httpsAgent: httpsAgent 
      });
      
      const responseData = response.data || {};
      const clients = responseData.data || responseData.clients || [];
      
      return res.json({ success: true, count: clients.length, data: clients });
    } catch (err: any) {
      console.error('[SYNC CLIENTS ERROR]', err.message);
      return res.status(500).json({ error: 'Sync failed', message: err.message });
    }
  }

  static async genericProxy(req: Request, res: Response) {
    const rawPath = req.path.replace(/^\/|\/$/g, '');
    const targetPath = rawPath.toLowerCase();
    
    // ignore empty root
    if (req.url === '/' && req.path === '/') return res.sendStatus(200);

    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      console.log(`[PROXY] ${req.method} ${rawPath}`);
      
      const headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: headers,
        timeout: 60000,
        httpsAgent: httpsAgent
      });
      
      console.log(`[PROXY] Success ${targetUrl}`);
      return res.json(response.data);
    } catch (error: any) {
      console.error(`[PROXY] Error ${targetPath}`, error.message);
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
  }
}
