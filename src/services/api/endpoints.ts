export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'proxy/auth/login',
  },
  DASHBOARD: {
    STAGE20_TOTALS: 'proxy/admin/orders/stage20/totals',
    SYNC_STAGE20: 'orders/sync',
    PRODUCED: 'proxy/dashboard/produced'
  },
  PRODUCTS: {
    LIST: 'proxy/products',
    SYNC: 'products/sync',
    SYNC_STOCK: 'proxy/admin/omie/products/stock/refresh',
    ADMIN: 'proxy/admin/products',
  },
  SECTORS: {
    BASE: 'proxy/admin/sectors',
  },
  PLANNING: {
    BASE: 'proxy/admin/planning',
  },
  PRODUCTION: {
    PRODUCED: 'proxy/admin/produced',
    SCHEDULES: 'proxy/admin/schedules',
  },
  GOALS: {
    BASE: 'proxy/admin/goals',
  },
  ORDERS: {
    BASE: 'proxy/orders',
  },
  CUSTOMERS: {
    BASE: 'proxy/clients',
    SYNC: 'clients/sync',
  }
} as const;
