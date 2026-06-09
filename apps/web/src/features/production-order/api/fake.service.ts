import { IProductionOrderService } from './contract';
import { ProductionOrder, CreateProductionOrderDTO, UpdateProductionOrderDTO } from '../models/types';

const MOCK_DATA_KEY = '@app/fake_production_orders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FakeProductionOrderService implements IProductionOrderService {
  private getOrders(): ProductionOrder[] {
    const data = localStorage.getItem(MOCK_DATA_KEY);
    if (!data) {
      const initial: ProductionOrder[] = [
        {
          id: '1',
          code: 'OP-001',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: [{ id: 'item-1', productId: 'p1', productName: 'Produto A', quantity: 10 }]
        }
      ];
      this.saveOrders(initial);
      return initial;
    }
    return JSON.parse(data);
  }

  private saveOrders(orders: ProductionOrder[]) {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(orders));
  }

  async list(): Promise<ProductionOrder[]> {
    await delay(800); // Simula latência de rede
    return this.getOrders();
  }

  async getById(id: string): Promise<ProductionOrder | null> {
    await delay(500);
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  async create(data: CreateProductionOrderDTO): Promise<ProductionOrder> {
    await delay(1000);
    const orders = this.getOrders();
    
    const newOrder: ProductionOrder = {
      id: Math.random().toString(36).substr(2, 9),
      code: `OP-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: data.items.map((item, index) => ({
         id: `item-${new Date().getTime()}-${index}`,
         productId: item.productId,
         productName: `Produto Falso ${item.productId}`, // mock name
         quantity: item.quantity
      })),
      notes: data.notes
    };
    
    orders.push(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  async update(id: string, data: UpdateProductionOrderDTO): Promise<ProductionOrder> {
    await delay(800);
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Ordem de Produção não encontrada');
    
    orders[index] = {
      ...orders[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.saveOrders(orders);
    return orders[index];
  }

  async cancel(id: string): Promise<void> {
    await delay(800);
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Ordem de Produção não encontrada');
    
    orders[index].status = 'CANCELED';
    orders[index].updatedAt = new Date().toISOString();
    
    this.saveOrders(orders);
  }
}
