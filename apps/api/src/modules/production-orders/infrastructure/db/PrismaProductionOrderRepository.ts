import { IProductionOrderRepository } from '../../application/ports/IProductionOrderRepository.js';
import { ProductionOrderDTO } from '../../application/dtos/ProductionOrderDTO.js';
import { prisma } from '../../../../infra/prisma.js';

export class PrismaProductionOrderRepository implements IProductionOrderRepository {
  async getAll(): Promise<ProductionOrderDTO[]> {
    const orders = await prisma.productionOrder.findMany();
    return orders.map(this.mapToDTO);
  }

  async getById(id: string): Promise<ProductionOrderDTO | null> {
    const order = await prisma.productionOrder.findUnique({ where: { id } });
    if (!order) return null;
    return this.mapToDTO(order);
  }

  async save(order: ProductionOrderDTO): Promise<ProductionOrderDTO> {
    const saved = await prisma.productionOrder.create({
      data: {
        id: order.id,
        lote: order.lote,
        productId: order.productId,
        productCode: order.productCode,
        productDescription: order.productDescription,
        quantity: typeof order.quantity === 'string' ? parseInt(order.quantity, 10) : order.quantity,
        sectorId: order.sectorId,
        sectorName: order.sectorName,
        collaboratorId: order.collaboratorId,
        collaboratorName: order.collaboratorName,
        status: order.status,
        startDate: order.startDate ? new Date(order.startDate) : undefined,
        endDate: order.endDate ? new Date(order.endDate) : undefined,
        notes: order.notes,
      },
    });
    return this.mapToDTO(saved);
  }

  async update(id: string, data: Partial<ProductionOrderDTO>): Promise<ProductionOrderDTO> {
    const updated = await prisma.productionOrder.update({
      where: { id },
      data: {
        lote: data.lote,
        productId: data.productId,
        productCode: data.productCode,
        productDescription: data.productDescription,
        quantity: typeof data.quantity === 'string' ? parseInt(data.quantity, 10) : data.quantity,
        sectorId: data.sectorId,
        sectorName: data.sectorName,
        collaboratorId: data.collaboratorId,
        collaboratorName: data.collaboratorName,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        notes: data.notes,
      },
    });
    return this.mapToDTO(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.productionOrder.delete({ where: { id } });
  }

  private mapToDTO(model: any): ProductionOrderDTO {
    return {
      id: model.id,
      lote: model.lote,
      productId: model.productId || undefined,
      productCode: model.productCode,
      productDescription: model.productDescription,
      quantity: model.quantity,
      sectorId: model.sectorId || undefined,
      sectorName: model.sectorName || undefined,
      collaboratorId: model.collaboratorId || undefined,
      collaboratorName: model.collaboratorName || undefined,
      status: model.status as any,
      startDate: model.startDate ? model.startDate.toISOString() : undefined,
      endDate: model.endDate ? model.endDate.toISOString() : undefined,
      notes: model.notes || undefined,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
    };
  }
}
