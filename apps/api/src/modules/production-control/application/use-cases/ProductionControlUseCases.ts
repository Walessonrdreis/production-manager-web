import { prisma } from '../../../../infra/prisma.js';

export class GetStage20TotalsUseCase {
  static async execute() {
    try {
      const orders = await prisma.order.findMany();
      const parsedOrders = orders.map(o => {
        try {
          return JSON.parse(o.data);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      const aggregated = new Map<string, number>();
      
      for (const order of parsedOrders) {
        if (!order || !order.items) continue;
        for (const item of order.items) {
          const desc = item.product?.description || item.description || item.descricao || item.descr || 'Item sem descrição';
          const qty = Number(item.quantity || item.quantidade || 0);
          aggregated.set(desc, (aggregated.get(desc) || 0) + qty);
        }
      }

      const products = Array.from(aggregated.entries()).map(([desc, qty]) => ({
        description: desc,
        totalQuantity: qty
      }));

      const totalUnits = products.reduce((acc, curr) => acc + curr.totalQuantity, 0);

      return {
        data: products,
        totalItems: totalUnits
      };
    } catch (err: any) {
      console.error('[GetStage20TotalsUseCase] Error reading from DB:', err.message);
      return { data: [], totalItems: 0 };
    }
  }
}
