import { Request, Response } from 'express';
import axios from 'axios';
import https from 'https';

// Criamos um agente HTTPS persistente
const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 120000
});
httpsAgent.setMaxListeners(100);
httpsAgent.on('socket', (socket) => {
  socket.setMaxListeners(100);
});

// Proxy methods from server.ts
export class ProxyController {
  
  static async genericProxy(req: Request, res: Response) {
    const rawPath = req.path.replace(/^\/|\/$/g, '');
    const targetPath = rawPath.toLowerCase();
    
    // ignore empty root
    if (req.url === '/' && req.path === '/') return res.sendStatus(200);

    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/${targetPath}`;
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
        timeout: 120000,
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
