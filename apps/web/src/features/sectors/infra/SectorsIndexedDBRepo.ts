import { SectorSync } from '../../../db/models';
import { sectorsDb } from './SectorsDB';
import { db } from '../../../db';
import { v4 as uuidv4 } from 'uuid';

export class SectorsIndexedDBRepo {
  private migrationPromise: Promise<void> | null = null;

  public async ensureMigration() {
    if (this.migrationPromise) return this.migrationPromise;
    
    this.migrationPromise = (async () => {
      // Verifica se a migração já foi marcada como concluída
      const config = await sectorsDb.config.get('migration_done');
      if (config) return;

      const count = await sectorsDb.sectors.count();
      if (count === 0) {
        try {
          const oldSectors = await db.sectors.toArray();
          if (oldSectors.length > 0) {
            console.log(`Migrando ${oldSectors.length} setores para o novo SectorsDB...`);
            const migrateItems: SectorSync[] = oldSectors.map(s => ({
              id: s.id || uuidv4(),
              name: s.name,
              description: s.description || '',
              productCodes: [], // Inicialmente vazio na migração
              synced: false,
              lastModified: Date.now(),
              version: 1
            }));
            await sectorsDb.sectors.bulkAdd(migrateItems);
            // Limpa o banco legado para evitar re-migrações acidentais
            try {
              await db.sectors.clear();
              console.log('Banco legado de setores limpo com sucesso.');
            } catch (e) {
              console.warn('Não foi possível limpar o banco legado de setores:', e);
            }
          }
          // Marca migração como concluída mesmo que não houvesse dados para migrar
          await sectorsDb.config.put({ key: 'migration_done', value: true });
        } catch (e) {
          console.error('Falha na migração de setores:', e);
        }
      } else {
        // Se já existem dados, assumimos que a migração foi feita ou não é necessária
        await sectorsDb.config.put({ key: 'migration_done', value: true });
      }
    })();
    
    return this.migrationPromise;
  }

  async getAll(): Promise<SectorSync[]> {
    return await sectorsDb.sectors.toArray();
  }

  async getById(id: string): Promise<SectorSync | null> {
    return await sectorsDb.sectors.get(id) || null;
  }

  async save(sector: SectorSync): Promise<void> {
    await this.ensureMigration();
    await sectorsDb.sectors.put({
      ...sector,
      lastModified: Date.now(),
      synced: sector.synced !== undefined ? sector.synced : false
    });
  }

  async delete(id: string): Promise<void> {
    await this.ensureMigration();
    await sectorsDb.sectors.delete(id);
  }

  async addProductToSector(sectorId: string, productCode: string): Promise<void> {
    await this.ensureMigration();
    const sector = await sectorsDb.sectors.get(sectorId);
    if (sector && !sector.productCodes.includes(productCode)) {
      await sectorsDb.sectors.update(sectorId, {
        productCodes: [...sector.productCodes, productCode],
        lastModified: Date.now(),
        synced: false
      });
    }
  }

  async removeProductFromSector(sectorId: string, productCode: string): Promise<void> {
    await this.ensureMigration();
    const sector = await sectorsDb.sectors.get(sectorId);
    if (sector) {
      await sectorsDb.sectors.update(sectorId, {
        productCodes: sector.productCodes.filter(c => c !== productCode),
        lastModified: Date.now(),
        synced: false
      });
    }
  }
}

export const sectorsLocalRepository = new SectorsIndexedDBRepo();
