import axios from 'axios';
import https from 'https';

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
  httpsAgent: httpsAgent
});
