import { CreateProductionOrderCommand } from '../../application/dtos/CreateProductionOrderCommand.js';

export interface IntegrationResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
}

export class Api1IntegrationClient {
  private static readonly TIMEOUT_MS = 2000;

  static async createProductionOrder(
    command: CreateProductionOrderCommand
  ): Promise<IntegrationResponse> {
    const baseUrl = process.env.API1_BASE_URL;
    
    if (!baseUrl) {
      console.warn('[Api1IntegrationClient] API1_BASE_URL não está configurada');
      return {
        success: false,
        error: 'INTEGRATION_UNAVAILABLE',
        message: 'Variável de ambiente API1_BASE_URL ausente',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await fetch(`${baseUrl}/v1/integration/production-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-External-Request-Id': command.externalRequestId,
        },
        body: JSON.stringify({
          productId: command.productId,
          quantity: command.quantity,
          scheduledDate: command.scheduledDate,
          notes: command.notes
        }),
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return data;
      }

      return data;

    } catch (error) {
      console.error('[Api1IntegrationClient] Falha ao chamar a API 1:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown integration error';

      return {
        success: false,
        error: 'INTEGRATION_UNAVAILABLE',
        message: errorMessage,
      };
    }
  }
}
