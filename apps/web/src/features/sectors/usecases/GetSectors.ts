import { Sector } from '../../../types/api';
import { SectorsRepository } from '../infra/SectorsRepository';
import { sectorsLocalRepository } from '../infra/SectorsIndexedDBRepo';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Busca a lista de setores do sistema (Network-First).
 */
export async function getSectors(): Promise<Result<Sector[]>> {
  try {
    const sectors = await SectorsRepository.getAll({ includeInactive: true });
    
    // Salva em background no cache local para resiliência offline (silenciosamente)
    setTimeout(() => {
      sectors.forEach((sector) => {
        if (!sector.id) return;
        sectorsLocalRepository.save({
          id: sector.id,
          name: sector.name,
          description: sector.description || '',
          productCodes: [], // Default migration ou map
          synced: true,
          version: 1,
          lastModified: Date.now()
        }).catch(() => {}); // catch silencioso
      });
    }, 0);

    return Result.ok(sectors);
  } catch (err: any) {
    console.error('[UseCase] Erro ao buscar setores da API, tentando usar Cache Local:', err);
    try {
      const localSectors = await sectorsLocalRepository.getAll();
      if (localSectors && localSectors.length > 0) {
        const mapped: Sector[] = localSectors.map(ls => ({
          id: ls.id,
          name: ls.name,
          description: ls.description,
          isActive: true
        }));
        return Result.ok(mapped);
      }
    } catch(localErr) {
      console.error('[UseCase] Erro ao acessar Cache Local de Setores:', localErr);
    }
    return Result.fail(err.message || 'Erro ao buscar setores.');
  }
}
