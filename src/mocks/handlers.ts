import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '../shared/api/endpoints';

const BASE_URL = 'https://production-manager-api.onrender.com/v1';

export const handlers = [
  // Mock Dashboard Totals
  http.get(`${BASE_URL}${ENDPOINTS.DASHBOARD.STAGE20_TOTALS}`, () => {
    return HttpResponse.json({
      data: [
        { description: 'Cadeira Ergonômica Pro', totalQuantity: 450 },
        { description: 'Mesa de Escritório X', totalQuantity: 280 },
        { description: 'Gaveteiro Metálico', totalQuantity: 120 },
        { description: 'Luminária LED Tech', totalQuantity: 690 },
      ]
    });
  }),

  // Mock Products List
  http.get(`${BASE_URL}${ENDPOINTS.PRODUCTS.LIST}`, () => {
    return HttpResponse.json([
      { id: '1', code: 'PRD-001', description: 'Cadeira Ergonômica Pro', family: 'Móveis', unit: 'UN', sectorId: '1' },
      { id: '2', code: 'PRD-002', description: 'Mesa de Escritório X', family: 'Móveis', unit: 'UN', sectorId: '1' },
      { id: '3', code: 'PRD-004', description: 'Luminária LED Tech', family: 'Iluminação', unit: 'UN' },
    ]);
  }),

  // Mock Sectors
  http.get(`${BASE_URL}${ENDPOINTS.SECTORS.BASE}`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Montagem Fina', description: 'Setor de acabamento e montagem final', color: 'blue' },
      { id: '2', name: 'Corte e Usinagem', description: 'Preparação de peças metálicas', color: 'slate' },
    ]);
  }),

  // Mock Orders
  http.get(`${BASE_URL}${ENDPOINTS.ORDERS.BASE}`, () => {
    return HttpResponse.json([
      { 
        id: '1', 
        orderNumber: '10245', 
        customerName: 'Loja de Móveis Central', 
        items: [
            { productId: '1', productCode: 'PRD-001', description: 'Cadeira Ergonômica Pro', quantity: 10, family: 'Móveis' }
        ],
        status: 'pending',
        createdAt: new Date().toISOString()
      },
    ]);
  }),

  // Mock Authentication
  http.post(`${BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, async ({ request }) => {
    const { email, password } = await request.json() as any;

    if (password === 'error') {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    return HttpResponse.json({
      token: 'mock-jwt-token-abcd-1234',
      user: {
        id: 'user-1',
        name: 'Administrador Demo',
        email: email,
        role: 'admin'
      }
    });
  }),
];
