import { DashboardAdapter } from '../../infrastructure/integrations/dashboard.adapter.js';

export class GetStage20TotalsUseCase {
  static async execute() {
    const data = await DashboardAdapter.fetchStage20Totals();
    return { data };
  }
}
