export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
  },
  DASHBOARD: {
    STAGE20_TOTALS: 'dashboard/stage20/totals',
    SYNC_STAGE20: 'orders/sync',
    PRODUCED: 'dashboard/produced'
  },
  CATALOG: {
    LIST: 'catalog',
    SYNC: 'catalog/sync',
    SYNC_STOCK: 'catalog/stock/refresh',
    ADMIN: 'catalog/admin',
  },
  STOCKS: {
    BASE: 'stocks',
  },
  PRODUCTS: {
    LIST: 'products',
    SYNC: 'products/sync',
    SYNC_STOCK: 'products/stock/refresh',
    ADMIN: 'products/admin',
  },
  SECTORS: {
    BASE: 'sectors',
  },
  PLANNING: {
    BASE: 'planning',
  },
  PRODUCTION: {
    PRODUCED: 'production/produced',
    SCHEDULES: 'production/schedules',
  },
  GOALS: {
    BASE: 'goals',
  },
  ORDERS: {
    BASE: 'orders',
  },
  CUSTOMERS: {
    BASE: 'clients',
    SYNC: 'clients/sync',
  },
  COLLABORATORS: {
    BASE: 'collaborators',
  }
} as const;
