import { legacyPrisma } from '../../../../infra/prisma.js';

export class GetStage20TotalsUseCase {
  static async execute() {
    try {
      const orders = await legacyPrisma.order.findMany();
      const parsedOrders = orders.map(o => {
        try {
          return JSON.parse(o.data);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return { data: parsedOrders };
    } catch (err: any) {
      console.error('[GetStage20TotalsUseCase] Error reading from DB:', err.message);
      return { data: [] };
    }
  }
}
