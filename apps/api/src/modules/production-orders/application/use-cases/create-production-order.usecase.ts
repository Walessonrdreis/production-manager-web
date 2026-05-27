import { ProductionOrderIntegrationClient } from "../clients/production-order.integration-client";
import { ProductReadRepository } from "../../../products/application/ports/product-read.repository";

type Input = {
  productCode: string;
  quantity: number;
  scheduledDate: string;
  externalRequestId: string;
};

export class CreateProductionOrderUseCase {
  constructor(
    private readonly productReadRepo: ProductReadRepository,
    private readonly integrationClient: ProductionOrderIntegrationClient
  ) {}

  async execute(input: Input) {
    // ✅ 1. Resolver productCode → produto interno
    const product = await this.productReadRepo.findByCode(input.productCode);

    if (!product) {
      throw {
        code: "PRODUCT_NOT_FOUND",
        message: "Produto não encontrado",
      };
    }

    if (!product.canCreateProductionOrder) {
      throw {
        code: "PRODUCT_NOT_ELIGIBLE",
        message: "Produto não pode gerar ordem de produção",
      };
    }

    /**
     * ✅ 2. Normalização FINAL
     * productId = codigo_produto (ID real do Omie)
     */
    const command = {
      productId: String(product.omieProductId), // ← codigo_produto
      quantity: input.quantity,
      scheduledDate: input.scheduledDate,
      externalRequestId: input.externalRequestId,
    };

    // ✅ 3. Enviar comando para API 1
    await this.integrationClient.createProductionOrder(command);

    return {
      externalRequestId: input.externalRequestId,
      status: "ACCEPTED",
    };
  }
}
