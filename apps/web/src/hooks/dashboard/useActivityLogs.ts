import { useQuery } from '@tanstack/react-query';
import { ProducedRepository } from '../../features/production/infra/ProducedRepository';
import { PlanningRepository } from '../../features/planner/infra/PlanningRepository';
import { GoalsRepository } from '../../features/goals/infra/GoalsRepository';
import { ApiMyProductsRepository } from '../../features/stocks/infra/ApiMyProductsRepository';

export interface ActivityLogItem {
  id: string;
  timestamp: Date;
  type: 'production' | 'planning' | 'goal' | 'product';
  title: string;
  description: string;
  user?: string;
  synced: boolean;
}

export function useActivityLogs() {
  return useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      try {
        const [produced, planning, goals, products] = await Promise.all([
          ProducedRepository.getAll(),
          PlanningRepository.getAll(),
          GoalsRepository.getAll(),
          ApiMyProductsRepository.getAll()
        ]);

        const logs: ActivityLogItem[] = [];

        produced.forEach(p => {
          if (p.updatedAt) {
            logs.push({
              id: `prod-${p.id}`,
              timestamp: new Date(p.updatedAt),
              type: 'production',
              title: 'Produção Registrada',
              description: `Registrado ${p.quantity}x de ${p.description}`,
              user: 'Sistema',
              synced: !!p.synced
            });
          }
        });

        planning.forEach(p => {
          if (p.updatedAt || p.lastModified) {
            logs.push({
              id: `plan-${p.id}`,
              timestamp: new Date(p.updatedAt || p.lastModified),
              type: 'planning',
              title: 'Planejamento de Produção',
              description: `Programado ${p.quantity}x para o produto: ${p.description}`,
              user: 'Sistema',
              synced: !!p.synced
            });
          }
        });

        goals.forEach(g => {
          if (g.updatedAt || g.lastModified) {
            logs.push({
              id: `goal-${g.id}`,
              timestamp: new Date(g.updatedAt || g.lastModified),
              type: 'goal',
              title: 'Meta Configurada',
              description: `Meta de ${g.targetQuantity} definida para ${g.productCode}`,
              user: 'Sistema',
              synced: !!g.synced
            });
          }
        });

        products.forEach(pr => {
          if (pr.lastModified || pr.savedAt) {
            logs.push({
              id: `prod-cat-${pr.id}`,
              timestamp: new Date(pr.lastModified || pr.savedAt || new Date()),
              type: 'product',
              title: pr.synced ? 'Produto Favoritado/Salvo' : 'Produto Favoritado',
              description: `Produto: ${pr.description} (${pr.code || pr.id})`,
              user: 'Sistema',
              synced: !!pr.synced
            });
          }
        });

        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50); // Get latest 50
      } catch (e) {
        console.error('Error fetching activity logs:', e);
        return [];
      }
    },
    refetchInterval: 10000 // refetch every 10 secs
  });
}
