import { IProductRepository } from '../domain/IProductRepository';
import { SavedProduct } from '../../../db/models';
import { catalogDb } from './CatalogDB';
import { db } from '../../../db';

export class ProductIndexedDBRepo implements IProductRepository {
  private migrationPromise: Promise<void> | null = null;

  public async ensureMigration() {
    if (this.migrationPromise) return this.migrationPromise;
    
    this.migrationPromise = (async () => {
      // Verifica se a migração já foi concluída
      const config = await catalogDb.config.get('migration_done');
      if (config) return;

      const count = await catalogDb.products.count();
      if (count === 0) {
        // Tenta migrar do banco antigo se houver dados
        try {
          const oldProducts = await db.myProducts.toArray();
          if (oldProducts.length > 0) {
            console.log(`Migrando ${oldProducts.length} produtos para o novo CatalogDB...`);
            const migrateItems: SavedProduct[] = oldProducts.map(p => ({
              ...p,
              synced: p.synced ?? false,
              lastModified: p.lastModified ?? Date.now(),
              version: p.version ?? 1,
              sectorIds: (p as any).sectorId ? [(p as any).sectorId] : []
            }));
            await catalogDb.products.bulkAdd(migrateItems);
            // Limpa o banco legado
            try {
              await db.myProducts.clear();
            } catch (e) {
              console.warn('Falha ao limpar banco legado de produtos:', e);
            }
          }
          await catalogDb.config.put({ key: 'migration_done', value: true });
        } catch (e) {
          console.error('Falha na migração do catálogo:', e);
        }
      } else {
        await catalogDb.config.put({ key: 'migration_done', value: true });
      }
    })();
    
    return this.migrationPromise;
  }

  async getAll(): Promise<SavedProduct[]> {
    return await catalogDb.products.toArray();
  }

  async getById(id: string): Promise<SavedProduct | null> {
    return await catalogDb.products.get(id) || null;
  }

  async getByCode(code: string): Promise<SavedProduct | null> {
    return await catalogDb.products.where('code').equals(code).first() || null;
  }

  async save(product: SavedProduct): Promise<void> {
    await this.ensureMigration();
    await catalogDb.products.put({
      ...product,
      lastModified: Date.now(),
      synced: false
    });
  }

  async delete(id: string): Promise<void> {
    await this.ensureMigration();
    await catalogDb.products.delete(id);
  }

  async search(query: string): Promise<SavedProduct[]> {
    await this.ensureMigration();
    const lowerQuery = query.toLowerCase();
    return await catalogDb.products
      .filter(p => 
        (p.description || '').toLowerCase().includes(lowerQuery) || 
        (p.code || '').toLowerCase().includes(lowerQuery)
      )
      .toArray();
  }

  async updateSectors(productId: string, sectorIds: string[]): Promise<void> {
    await this.ensureMigration();
    await catalogDb.products.update(productId, {
      sectorIds,
      lastModified: Date.now(),
      synced: false
    });
  }
}

export const productRepository = new ProductIndexedDBRepo();
