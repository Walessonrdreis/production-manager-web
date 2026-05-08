export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
  },
  DASHBOARD: {
    STAGE20_TOTALS: 'admin/orders/stage20/totals',
    SYNC_STAGE20: 'admin/omie/orders/stage20/sync',
    PRODUCED: 'dashboard/produced'
  },
  PRODUCTS: {
    LIST: 'products',
    SYNC: 'admin/omie/sync/products',
    SYNC_STOCK: 'admin/omie/products/stock/refresh',
    ADMIN: 'admin/products',
  },
  SECTORS: {
    BASE: 'admin/sectors',
  },
  PLANNING: {
    BASE: 'admin/planning',
  },
  PRODUCTION: {
    PRODUCED: 'admin/produced',
    SCHEDULES: 'admin/schedules',
  },
  GOALS: {
    BASE: 'admin/goals',
  },
  ORDERS: {
    BASE: 'orders',
  },
  CUSTOMERS: {
    BASE: 'clients',
    SYNC: 'admin/omie/clients/sync',
  }
} as const;
