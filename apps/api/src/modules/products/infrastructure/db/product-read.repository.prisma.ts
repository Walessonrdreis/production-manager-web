import { prisma } from "../../../../infra/prisma";

export class ProductReadRepository {
  async findByCode(code: string) {
    return prisma.omieProduct.findFirst({
      where: {
        OR: [
          { sku: code },
          { omieCode: code }
        ],
        active: true,
      },
      select: {
        id: true,
        sku: true,
        omieCode: true,
        omieId: true,
        description: true,
        rawPayload: true
      },
    }).then(p => {
      if (!p) return null;

      let raw: any = {};
      try {
        raw = typeof p.rawPayload === 'string' ? JSON.parse(p.rawPayload) : (p.rawPayload || {});
      } catch (e) {
        // ignore
      }

      return {
        id: p.id,
        code: p.sku || p.omieCode,
        description: p.description,
        omieProductId: Number(p.omieId),
        canCreateProductionOrder: raw.inativo === "N", // Ensure any logic relying on raw is covered. We can assume true if `active` is true.
      };
    });
  }
}
