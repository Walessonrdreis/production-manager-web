import { prisma } from '../../../../infra/prisma.js';

export class CoreProductStockRepository {
  static async getAll() {
    // 4. Limite de payload para evitar sobrecarga (MAX 1000)
    const stocks = await prisma.productStock.findMany({
      take: 1000,
      orderBy: { updatedAt: 'desc' }
    });
    return stocks.map(stock => ({
      id: stock.omieCode,
      codigo: stock.omieCode,
      omieCode: stock.omieCode,
      quantidade: Number(stock.stockQuantity),
      stockQuantity: Number(stock.stockQuantity),
      minimumStock: Number(stock.minimumStock),
      updatedAt: stock.updatedAt
    }));
  }

  static async getById(id: string) {
    const stock = await prisma.productStock.findUnique({ where: { omieCode: id } });
    if (!stock) return null;
    return {
      id: stock.omieCode,
      codigo: stock.omieCode,
      omieCode: stock.omieCode,
      quantidade: Number(stock.stockQuantity),
      stockQuantity: Number(stock.stockQuantity),
      minimumStock: Number(stock.minimumStock),
      updatedAt: stock.updatedAt
    };
  }
}
