import { SectorsAdapter } from '../../infrastructure/integrations/sectors.adapter.js';

export class UpdateSectorUseCase {
  static async execute(id: string, sector: any) {
    const updated = await SectorsAdapter.updateSector(id, sector);
    return { data: updated };
  }
}
