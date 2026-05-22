import { PrismaStocksRepository } from '../../infrastructure/db/PrismaStocksRepository.js';
import { CoreProductStockRepository } from '../../infrastructure/db/CoreProductStockRepository.js';
import { StockShadowReadService } from '../services/StockShadowReadService.js';

export class GetStocksUseCase {
  static async execute() {
    // 1. Executa background shadow-read paralelamente
    setTimeout(() => {
      StockShadowReadService.executeComparison();
    }, 100);

    // 2. Feature Flag: Seleciona Fonte de Leitura
    const source = process.env.STOCK_READ_SOURCE || 'legacy';

    if (source === 'core') {
      try {
        const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms));
        
        const coreStocks = await Promise.race([
          CoreProductStockRepository.getAll(),
          timeout(2000) // 2s timeout
        ]) as any;

        // Metric success (optional, keeping minimal log)
        return coreStocks;
      } catch (err) {
        // Métrica real de fallback!
        console.warn(`[METRICS: FALLBACK] Fallback acionado em getAll() - Motivo: ${err instanceof Error ? err.message : 'Unknown'}`);
        return await PrismaStocksRepository.getAll();
      }
    }

    // Default Legacy Return
    return await PrismaStocksRepository.getAll();
  }
}

export class GetStockByIdUseCase {
  static async execute(id: string) {
    const source = process.env.STOCK_READ_SOURCE || 'legacy';

    if (source === 'core') {
      try {
        const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms));
        
        const coreStock = await Promise.race([
          CoreProductStockRepository.getById(id),
          timeout(2000)
        ]) as any;
        
        return coreStock;
      } catch (err) {
        console.warn(`[METRICS: FALLBACK] Fallback acionado em getById(${id}) - Motivo: ${err instanceof Error ? err.message : 'Unknown'}`);
        return await PrismaStocksRepository.getById(id);
      }
    }

    return await PrismaStocksRepository.getById(id);
  }
}

export class SaveStockUseCase {
  static async execute(id: string, data: any) {
    return await PrismaStocksRepository.save(id, data);
  }
}

export class DeleteStockUseCase {
  static async execute(id: string) {
    return await PrismaStocksRepository.delete(id);
  }
}

