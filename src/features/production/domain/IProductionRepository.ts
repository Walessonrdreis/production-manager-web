import { ProducedRecord } from '../../../db/models';
import { IRepository } from '../../../domain/contracts/IRepository';

export interface IProductionRepository extends IRepository<ProducedRecord> {
  getByOrder?(orderId: string): Promise<{ success: boolean; data?: ProducedRecord[]; error?: string }>;
}
