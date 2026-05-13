import { AppError } from '../../../../shared/errors/AppError.js';
import { prisma } from '../../../../infra/prisma.js';

export class PrismaStocksRepository {
  static async getById(id: string) {
    const stock = await prisma.stock.findUnique({ where: { id } });
    if (!stock) return null;
    const parsed = JSON.parse(stock.data);
    return { id: stock.id, ...parsed };
  }

  static async getAll() {
    const stocks = await prisma.stock.findMany();
    return stocks.map(stock => {
      const parsed = JSON.parse(stock.data);
      return { id: stock.id, ...parsed };
    });
  }

  static async save(id: string, data: any) {
    const stringified = JSON.stringify(data);
    await prisma.stock.upsert({
      where: { id },
      create: { id, data: stringified },
      update: { data: stringified }
    });
    return { id, ...data };
  }

  static async delete(id: string) {
    await prisma.stock.delete({ where: { id } });
  }
}
