export interface ProductionOrderV2 {
  id: string;
  item: string;
  quantity: number;
  status: 'OPENED' | 'LIVE' | 'REVIEW' | 'HISTORY' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

