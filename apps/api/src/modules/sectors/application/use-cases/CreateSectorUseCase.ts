import { SectorsAdapter } from '../../infrastructure/integrations/sectors.adapter.js';

export class CreateSectorUseCase {
  static async execute(sector: any) {
    const created = await SectorsAdapter.createSector(sector);
    return { data: created };
  }
}
