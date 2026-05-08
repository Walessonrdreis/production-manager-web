import { PlanningAdapter } from '../../infrastructure/integrations/planning.adapter.js';

export class GetPlanningUseCase {
  static async execute() {
    const rawData = await PlanningAdapter.fetchFromExternalAPI();
    return { data: rawData };
  }
}
