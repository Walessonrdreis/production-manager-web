import { ProductionAdapter } from '../../infrastructure/integrations/production.adapter.js';

export class GetProducedUseCase {
  static async execute() {
    const data = await ProductionAdapter.fetchProduced();
    return { data };
  }
}

export class GetSchedulesUseCase {
  static async execute() {
    const data = await ProductionAdapter.fetchSchedules();
    return { data };
  }
}
