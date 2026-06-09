export interface ProductionOrderV2 {
  id: string;
  item: string;
  quantity: number;
  status: 'OPENED' | 'LIVE' | 'REVIEW' | 'HISTORY' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  sector?: string;
  batch?: string;
  expectedCompletionDate?: string;
  bom?: {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
  }[];
}

