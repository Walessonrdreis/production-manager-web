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

export interface PlanningItem extends Syncable {
  batchId: string;      // ID do lote de planejamento
  productCode: string;  // SKU como link universal
  description: string;
  unit: string;
  quantity: number;
  sectorId?: string;
  sectorName?: string;
  updatedAt: string;
}

export interface PlanningBatch extends Syncable {
  name: string;         // Nome do lote (ex: "Semana 18 - Maranhão")
  date: string;         // Data do planejamento
  status: 'draft' | 'published' | 'completed';
  createdBy: string;
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

export interface Syncable {
  id: string;          // UUID gerado localmente
  synced: boolean;     // false = alteração local pendente
  lastModified: number; // Timestamp para resolução de conflitos
  version: number;     // Controle de concorrência
}

export interface SectorSync extends Syncable {
  name: string;
  description?: string;
  productCodes: string[]; // Lista de SKUs associados a este setor
}

export type SavedProduct = Product & Syncable & {
  savedAt: string;
  category?: string;
  sectorIds: string[]; // Relacionamento com setores
};

export interface ProductionSchedule extends Syncable {
  productCode: string; // SKU como link universal
  description: string;
  scheduledAt: string;
  notes?: string;
  updatedAt: string;
}
