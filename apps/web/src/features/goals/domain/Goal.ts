import { Syncable } from '../../../db/models';

export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface ProductionGoal extends Syncable {
  productCode: string;         // SKU (Identificador mestre)
  productDescription: string;  // Denormalizado para performance
  targetQuantity: number;
  period: GoalPeriod;
  sectorId?: string;           // Meta específica para um setor (opcional)
  isActive: boolean;
  updatedAt: string;           // ISO Timestamp
}
