import { legacyPrisma } from '../../../../infra/prisma.js';

export class GetPlanningUseCase {
  static async execute() {
    const rawData = await legacyPrisma.planningItem.findMany();
    return { data: rawData };
  }
}
