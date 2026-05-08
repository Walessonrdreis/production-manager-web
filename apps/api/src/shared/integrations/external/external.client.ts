import axios from 'axios';
import https from 'https';

export const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 60000
});
httpsAgent.setMaxListeners(100);

export const externalClient = axios.create({
  timeout: 60000,
  httpsAgent: httpsAgent
});
