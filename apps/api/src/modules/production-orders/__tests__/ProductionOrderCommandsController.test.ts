import { Request, Response } from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductionOrderCommandsController } from '../presentation/http/controllers/ProductionOrderCommandsController.js';
import { Api1IntegrationClient } from '../infrastructure/integration/Api1IntegrationClient.js';

// Mock do Api1IntegrationClient
vi.mock('../infrastructure/integration/Api1IntegrationClient.js', () => ({
  Api1IntegrationClient: {
    createProductionOrder: vi.fn(),
  },
}));

describe('ProductionOrderCommandsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as Partial<Response>;
    
    // Configura um payload válido padrão
    mockRequest = {
      body: {
        productId: 'prod-123',
        quantity: 100,
        externalRequestId: 'ext-req-abc-123',
      },
    } as Partial<Request>;

    process.env.COMMANDS_ENABLED = 'true';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 202 com status ACCEPTED em caso de sucesso', async () => {
    vi.mocked(Api1IntegrationClient.createProductionOrder).mockResolvedValue({
      success: true,
    });

    await ProductionOrderCommandsController.createOrder(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(202);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        externalRequestId: 'ext-req-abc-123',
        status: 'ACCEPTED',
      },
    });
    expect(Api1IntegrationClient.createProductionOrder).toHaveBeenCalledWith({
      productId: 'prod-123',
      quantity: 100,
      scheduledDate: undefined,
      notes: undefined,
      externalRequestId: 'ext-req-abc-123',
    });
  });

  it('deve retornar 501 quando COMMANDS_ENABLED for false', async () => {
    process.env.COMMANDS_ENABLED = 'false';

    await ProductionOrderCommandsController.createOrder(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(501);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'COMMANDS_DISABLED',
      message: 'Endpoint is not enabled',
    });
    expect(Api1IntegrationClient.createProductionOrder).not.toHaveBeenCalled();
  });

  it('deve retornar 400 em caso de payload inválido (faltando externalRequestId)', async () => {
    mockRequest.body = { ...mockRequest.body, externalRequestId: undefined };

    await ProductionOrderCommandsController.createOrder(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'INVALID_PAYLOAD',
      message: 'Missing required fields',
    });
  });

  it('deve retornar 500 caso a integração com a API 1 falhe', async () => {
    vi.mocked(Api1IntegrationClient.createProductionOrder).mockResolvedValue({
      success: false,
      error: 'INTEGRATION_UNAVAILABLE',
      message: 'Network timeout',
    });

    await ProductionOrderCommandsController.createOrder(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    // Observe que o controller mapeia o sucesso: false para o 500, então:
    // result (neste caso) é o que vem de CreateProductionOrderUseCase
    // CreateProductionOrderUseCase.execute retorna:
    // error: 'INTEGRATION_ERROR', message: 'Falha ao enviar comando'
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'INTEGRATION_ERROR',
      message: 'Falha ao enviar comando',
    });
  });
});
