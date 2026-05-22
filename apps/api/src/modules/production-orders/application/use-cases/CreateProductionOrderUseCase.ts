import { CreateProductionOrderCommand } from '../dtos/CreateProductionOrderCommand.js';
import { Api1IntegrationClient } from '../../infrastructure/integration/Api1IntegrationClient.js';

export class CreateProductionOrderUseCase {
  static async execute(command: CreateProductionOrderCommand) {
    console.log("[USECASE ENTRY]", command);
    const integrationResponse = await Api1IntegrationClient.createProductionOrder(command);

    if (!integrationResponse.success) {
      return integrationResponse;
    }

    return integrationResponse;
  }
}
