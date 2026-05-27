import { prisma } from "../../../../infra/prisma";

export class ProductReadRepository {
  async findByCode(code: string) {
    return prisma.omieProduct.findFirst({
      where: {
        codigo: code,
        inativo: "N",
      },
      select: {
        id: true,
        codigo: true,
        codigo_produto: true, // ← ID REAL DO OMIE
        descricao: true,
        canCreateProductionOrder: true,
      },
    }).then(p => {
      if (!p) return null;

      return {
        id: p.id,
        code: p.codigo,
        description: p.descricao,
        omieProductId: p.codigo_produto, // ← 9116171984
        canCreateProductionOrder: p.canCreateProductionOrder,
      };
    });
  }
}
