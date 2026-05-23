import { Api1OrdersIntegrationClient } from "../../infrastructure/integration/Api1OrdersIntegrationClient.js";

export class GetOrdersStage20UseCase {
  async execute(command: { externalRequestId: string }) {
    return Api1OrdersIntegrationClient.listStage20(command);
  }
}
