import { IProductionOrderService } from './contract';
import { ProductionOrder, CreateProductionOrderDTO, UpdateProductionOrderDTO } from '../models/types';

export class RealProductionOrderService implements IProductionOrderService {
  private baseUrl = '/api/production-orders';

  async list(): Promise<ProductionOrder[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Falha ao listar Ordens de Produção');
    return res.json();
  }

  async getById(id: string): Promise<ProductionOrder | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Falha ao buscar Ordem de Produção');
    return res.json();
  }

  async create(data: CreateProductionOrderDTO): Promise<ProductionOrder> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Falha ao criar Ordem de Produção');
    return res.json();
  }

  async update(id: string, data: UpdateProductionOrderDTO): Promise<ProductionOrder> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Falha ao atualizar Ordem de Produção');
    return res.json();
  }

  async cancel(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Falha ao cancelar Ordem de Produção');
  }
}
