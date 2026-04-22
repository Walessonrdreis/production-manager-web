export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
  },
  DASHBOARD: {
    STAGE20_TOTALS: 'admin/orders/stage20/totals',
    SYNC_STAGE20: 'admin/omie/orders/stage20/sync',
  },
  PRODUCTS: {
    LIST: 'products',
    SYNC: 'admin/omie/sync/products',
  },
  SECTORS: {
    BASE: 'sectors',
  },
  PLANNING: {
    BASE: 'planning',
  },
  ORDERS: {
    BASE: 'admin/orders',
  }
} as const;
