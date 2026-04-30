import { type Product } from '../types/api';

export interface ProducedRecord {
  id: string; // SKU or combined unique ID
  description: string;
  quantity: number;
  orderId?: string;
  orderNumber?: string;
  synced: boolean;
  updatedAt: string;
}

export interface PlanningItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  sectorId?: string;
  sectorName?: string;
  synced: boolean;
  updatedAt: string;
}

export interface APICache {
  key: string;
  data: any;
  expiresAt: number;
}

export interface Customer {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  omieCode?: string;
  updatedAt: string;
}

export type SavedProduct = Product & {
  savedAt: string;
};