import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { catalogDb } from '../../features/catalog/infra/CatalogDB';
import { sectorsDb } from '../../features/sectors/infra/SectorsDB';
import { planningDb } from '../../features/planner/infra/PlanningDB';
import { goalsDb } from '../../features/goals/infra/GoalsDB';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';

export interface PendingItem {
  id: string;
  type: 'produced' | 'planning' | 'catalog' | 'sector' | 'goal';
  title: string;
  subtitle?: string;
  timestamp?: string | number;
  rawItem: any;
}

export function usePendingDetails() {
  const pendingItems = useLiveQuery(async () => {
    try {
      const items: PendingItem[] = [];

      // Produção
      const produced = await db.produced.filter(r => !r.synced).toArray();
      produced.forEach(p => {
        items.push({
          id: p.id,
          type: 'produced',
          title: `Produção: ${p.description || 'Produto Desconhecido'}`,
          subtitle: `Quantidade: ${p.quantity} | ${new Date(p.updatedAt).toLocaleString('pt-BR')}`,
          timestamp: p.updatedAt,
          rawItem: p
        });
      });

      // Planejamento
      const planning = await planningDb.items.filter(r => !r.synced).toArray();
      planning.forEach(p => {
        items.push({
          id: p.id,
          type: 'planning',
          title: `Planejamento: ${p.description || 'Sem descrição'}`,
          subtitle: `Setor: ${p.sectorName || p.sectorId || 'N/A'} | Qtd: ${p.quantity}`,
          timestamp: p.lastModified,
          rawItem: p
        });
      });

      // Catálogo (Meus Produtos)
      const products = await catalogDb.products.filter(r => !r.synced).toArray();
      products.forEach(p => {
        items.push({
          id: p.id,
          type: 'catalog',
          title: `Produto: ${p.description || p.id}`,
          subtitle: `Família: ${p.family || 'N/A'}`,
          timestamp: p.lastModified,
          rawItem: p
        });
      });

      // Setores
      const sectors = await sectorsDb.sectors.filter(r => !r.synced).toArray();
      sectors.forEach(s => {
        items.push({
          id: s.id,
          type: 'sector',
          title: `Setor: ${s.name}`,
          subtitle: s.description || 'Sem descrição',
          timestamp: s.lastModified,
          rawItem: s
        });
      });

      // Metas
      const goals = await goalsDb.goals.filter(r => !r.synced).toArray();
      goals.forEach(g => {
        items.push({
          id: g.id,
          type: 'goal',
          title: `Meta: ${g.productCode}`,
          subtitle: `Qtd: ${g.targetQuantity} | Setor: ${g.sectorId || 'N/A'}`,
          timestamp: g.lastModified,
          rawItem: g
        });
      });

      // Ordenar por timestamp (mais recentes primeiro)
      return items.sort((a, b) => {
        const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : (a.timestamp || 0);
        const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : (b.timestamp || 0);
        return timeB - timeA;
      });
    } catch (e) {
      console.error('Error fetching pending details:', e);
      return [];
    }
  }, []);

  const syncAllPending = async () => {
    if (!pendingItems || pendingItems.length === 0) return;
    
    for (const item of pendingItems) {
      try {
        if (item.type === 'produced') {
          await apiClient.post(ENDPOINTS.PRODUCTION.PRODUCED, item.rawItem);
          await db.produced.update(item.id, { synced: true });
        } else if (item.type === 'planning') {
          await apiClient.post(ENDPOINTS.PLANNING.BASE, item.rawItem);
          await planningDb.items.update(item.id, { synced: true, version: (item.rawItem.version || 1) + 1 });
        } else if (item.type === 'catalog') {
          await apiClient.post(ENDPOINTS.PRODUCTS.ADMIN, item.rawItem);
          await catalogDb.products.update(item.id, { synced: true, version: (item.rawItem.version || 1) + 1 });
        } else if (item.type === 'sector') {
          await apiClient.post(ENDPOINTS.SECTORS.BASE, item.rawItem);
          await sectorsDb.sectors.update(item.id, { synced: true, version: (item.rawItem.version || 1) + 1 });
        } else if (item.type === 'goal') {
          await apiClient.post(ENDPOINTS.GOALS.BASE, item.rawItem);
          await goalsDb.goals.update(item.id, { synced: true, version: (item.rawItem.version || 1) + 1 });
        }
      } catch (e) {
        console.error(`Failed to sync item ${item.id} of type ${item.type}`, e);
      }
    }
  };

  return {
    items: pendingItems || [],
    count: pendingItems?.length || 0,
    isEmpty: (pendingItems?.length || 0) === 0,
    syncAllPending
  };
}

