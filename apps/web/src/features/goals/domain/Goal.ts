import { Syncable } from '../../../db/models';

export type GoalPeriod = 'daily' | 'weekly' | 'monthly';
export type GoalType = 'product' | 'collaborator' | 'sector';

export interface ProductionGoal extends Syncable {
  type?: GoalType; // Tornou opcional por retrocompatibilidade, se não tiver é 'product'
  
  // Produto
  productCode?: string;         
  productDescription?: string;  
  
  // Colaborador
  collaboratorId?: string;
  collaboratorName?: string;
  
  // Setor
  sectorId?: string;
  sectorName?: string;

  targetQuantity: number;
  period: GoalPeriod;
  isActive: boolean;
  updatedAt: string;           
}
