export interface Stage20Total {
  description: string;
  totalQuantity: number;
}

export interface DashboardTotalsResponse {
  data: Stage20Total[];
  totalItems?: number;
  lastUpdate?: string;
}

export interface Product {
  id: string;
  code: string;
  description: string;
  unit: string;
  family: string;
  familyDescription?: string;
  price: number;
  stock: number;
  sectorId?: string;
}

export interface Sector {
  id: string;
  name: string;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: any[];
  createdAt: string;
}
