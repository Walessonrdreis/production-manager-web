import { SectorsAdapter } from '../../infrastructure/integrations/sectors.adapter.js';

export class DeleteSectorUseCase {
  static async execute(id: string) {
    await SectorsAdapter.deleteSector(id);
    return { success: true };
  }
}
