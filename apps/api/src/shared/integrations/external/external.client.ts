import axios from 'axios';
import https from 'https';
import http from 'http';
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 100;

export const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 120000
});
httpsAgent.setMaxListeners(100);
httpsAgent.on('socket', (socket) => {
  socket.setMaxListeners(100);
});

export const externalClient = axios.create({
  timeout: 120000,
  httpsAgent: httpsAgent,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 })
});

externalClient.interceptors.request.use(config => {
  if (process.env.DISABLE_EXTERNAL_SYNC === 'true') {
    return Promise.reject(Object.assign(new Error('Integração com Omie (API externa) temporariamente desativada'), { response: { status: 503 } }));
  }
  return config;
});

externalClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = {
        count: 0,
        maxRetries: 5,
        delay: 5000 // 5 seconds initial delay
      };
    }
    
    // Check if it's a 502, 503, 504 and we haven't exceeded retries
    if (
      error.response && 
      [502, 503, 504].includes(error.response.status) && 
      config.retry.count < config.retry.maxRetries
    ) {
      config.retry.count += 1;
      const delayMs = config.retry.delay * Math.pow(2, config.retry.count - 1);
      console.warn(`[EXTERNAL API] Retrying request to ${config.url} due to ${error.response.status}... (Attempt ${config.retry.count}/${config.retry.maxRetries}) Delaying ${delayMs}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return externalClient(config);
    }
    
    return Promise.reject(error);
  }
);
