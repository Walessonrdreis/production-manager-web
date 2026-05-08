import * as dotenv from 'dotenv';
import events from 'events';

export function setupEnv() {
  dotenv.config();
  events.EventEmitter.defaultMaxListeners = 100;
  process.setMaxListeners(100);
}
