import { SectorsRepository } from '../infra/SectorsRepository';
import { Result } from '../../../lib/Result';
import { FirebaseSectorRepository } from '../infra/FirebaseSectorRepository';

/**
 * UseCase: Solicita sincronização de setores com a API Omie e salva no Firebase.
 */
export async function syncSectors(): Promise<Result<any>> {
  try {
    const { data } = await SectorsRepository.syncWithOmie();
    
    // Supondo que a API retorne os setores no campo data ou no array root
    const items = data?.data || data?.sectors || data?.items || (Array.isArray(data) ? data : []);
    
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (!item.id) continue;
        await FirebaseSectorRepository.save({
          id: item.id,
          name: item.name || 'Setor',
          color: item.color || null,
          description: item.description || null,
          productCodes: item.productCodes || [],
          synced: true,
          lastModified: Date.now(),
          version: 1,
          savedAt: new Date().toISOString()
        } as any);
      }
    }
    
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao sincronizar setores com a Omie.');
  }
}
