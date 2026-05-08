import { SectorsAdapter } from '../../infrastructure/integrations/sectors.adapter.js';

export class GetSectorsUseCase {
  static async execute() {
    const rawSectors = await SectorsAdapter.fetchFromExternalAPI();
    return { data: rawSectors };
  }
}
