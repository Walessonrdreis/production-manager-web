import { prisma } from '../../../../infra/prisma.js';

export class GetPlanningUseCase {
  static async execute() {
    const rawData = await prisma.planningItem.findMany();
    return { data: rawData };
  }
}
