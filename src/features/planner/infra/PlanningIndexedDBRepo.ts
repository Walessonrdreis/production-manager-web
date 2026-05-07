import { PlanningItem, PlanningBatch } from '../../../db/models';
import { planningDb } from './PlanningDB';
import { db } from '../../../db';
import { v4 as uuidv4 } from 'uuid';

export class PlanningIndexedDBRepo {
  private migrationPromise: Promise<void> | null = null;
  private readonly DEFAULT_BATCH_ID = 'legacy-batch';

  public async ensureMigration() {
    if (this.migrationPromise) return this.migrationPromise;
    
    this.migrationPromise = (async () => {
      // Verifica se a migração já foi concluída
      const config = await planningDb.config.get('migration_done');
      if (config) return;

      const itemsCount = await planningDb.items.count();
      if (itemsCount === 0) {
        try {
          const oldItems = await db.planning.toArray();
          if (oldItems.length > 0) {
            console.log(`Migrando ${oldItems.length} itens de planejamento para o novo PlanningDB...`);
            
            // Cria um lote padrão para os itens migrados
            const legacyBatch: PlanningBatch = {
              id: this.DEFAULT_BATCH_ID,
              name: 'Legado / Importado',
              date: new Date().toISOString(),
              status: 'published',
              createdBy: 'system',
              synced: false,
              lastModified: Date.now(),
              version: 1
            };
            await planningDb.batches.put(legacyBatch);

            const migrateItems: PlanningItem[] = oldItems.map(item => ({
              ...item,
              id: item.id || uuidv4(),
              batchId: (item as any).batchId || this.DEFAULT_BATCH_ID,
              productCode: (item as any).code || (item as any).productCode,
              synced: item.synced ?? false,
              lastModified: (item as any).lastModified || Date.now(),
              version: (item as any).version || 1
            }));
            await planningDb.items.bulkAdd(migrateItems);
            // Limpa o banco legado
            try {
              await db.planning.clear();
            } catch (e) {
              console.warn('Falha ao limpar banco legado de planejamento:', e);
            }
          }
          await planningDb.config.put({ key: 'migration_done', value: true });
        } catch (e) {
          console.error('Falha na migração do planejamento:', e);
        }
      } else {
        await planningDb.config.put({ key: 'migration_done', value: true });
      }
    })();
    
    return this.migrationPromise;
  }

  async getAllItems(): Promise<PlanningItem[]> {
    return await planningDb.items.toArray();
  }

  async getBatchItems(batchId: string): Promise<PlanningItem[]> {
    return await planningDb.items.where('batchId').equals(batchId).toArray();
  }

  async saveItem(item: PlanningItem): Promise<void> {
    await this.ensureMigration();
    await planningDb.items.put({
      ...item,
      lastModified: Date.now(),
      synced: false
    });
  }

  async deleteItem(id: string): Promise<void> {
    await this.ensureMigration();
    await planningDb.items.delete(id);
  }

  async getAllBatches(): Promise<PlanningBatch[]> {
    await this.ensureMigration();
    return await planningDb.batches.toArray();
  }

  async saveBatch(batch: PlanningBatch): Promise<void> {
    await this.ensureMigration();
    await planningDb.batches.put({
      ...batch,
      lastModified: Date.now(),
      synced: false
    });
  }
}

export const planningLocalRepository = new PlanningIndexedDBRepo();
