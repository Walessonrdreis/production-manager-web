import { GoalsAdapter } from '../../infrastructure/integrations/goals.adapter.js';

export class GetGoalsUseCase {
  static async execute() {
    const rawData = await GoalsAdapter.fetchFromExternalAPI();
    return { data: rawData };
  }
}
