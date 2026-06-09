import { StockRoomsGateway } from '../domain/StockRoomGateway';
import { FakeStockRoomsGateway } from './FakeStockRoomsGateway';

let instance: StockRoomsGateway | null = null;

export function getStockRoomsGateway(): StockRoomsGateway {
  if (!instance) {
    const useFake = import.meta.env.VITE_USE_FAKE_STOCK_ROOMS_API !== 'false'; // Defaults to true
    if (useFake) {
      instance = new FakeStockRoomsGateway();
    } else {
      // Future implementation for real API using Drizzle/Postgres
      // instance = new RealStockRoomsGateway();
      instance = new FakeStockRoomsGateway(); 
      console.warn('RealStockRoomsGateway is not implemented yet. Falling back to FakeStockRoomsGateway.');
    }
  }
  return instance;
}
