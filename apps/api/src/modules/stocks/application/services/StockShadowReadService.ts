import { legacyPrisma, prisma } from '../../../../infra/prisma.js';
export class StockShadowReadService {
  private static lastRunTimestamp: number = 0;
  private static readonly COOLDOWN_MS: number = 60000; // 1 minute cooldown
  private static executionCount: number = 0;
  private static readonly SAMPLE_RATE: number = 20; // run every 20 requests

  /**
   * Executa a leitura sombra paralelamente (Shadow Read)
   * Compara o banco oficial (prisma) com o banco legado (legacyPrisma)
   * NAO afeta o fluxo de requisições
   */
  static async executeComparison() {
    this.executionCount++;

    // Sampling: executa 1 a cada N vezes
    if (this.executionCount % this.SAMPLE_RATE !== 0) {
      return;
    }

    const now = Date.now();
    if (now - this.lastRunTimestamp < this.COOLDOWN_MS) {
      // Cooldown ativo, não executa
      return;
    }
    
    // Acquire "lock" early to prevent concurrent executions within this same event loop
    this.lastRunTimestamp = now;

    try {
      console.log('[Shadow Read - Stock] Initiating background comparison...');

      // Validações básicas para não falhar a aplicação (não-bloqueante)
      if (!process.env.LEGACY_DATABASE_URL || !process.env.LEGACY_DATABASE_URL.startsWith('postgres')) {
        console.warn('[Shadow Read - Stock] Legacy database not available. Skipping comparison.');
        return;
      }

      if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
        console.warn('[Shadow Read - Stock] Primary database not available. Skipping comparison.');
        return;
      }

      // 1. Snapshot da fonte legado (API 2)
      const legacyStocksRaw = await legacyPrisma.stock.findMany();
      const legacyStocks = legacyStocksRaw.map(s => {
        try {
          return { id: s.id, ...JSON.parse(s.data) };
        } catch {
          return { id: s.id, _error: true };
        }
      });
      const totalLegacy = legacyStocks.length;

      // 2. Snapshot da fonte oficial (API 1)
      const primaryStocks = await prisma.productStock.findMany();
      const totalPrimary = primaryStocks.length;

      let differences = 0;
      const topDifferences: any[] = [];

      // 3. Comparativo
      for (const leg of legacyStocks) {
        if (leg._error) continue;
        
        // Identificar o omieCode no JSON (depende do payload anterior)
        const code = leg.omieCode || leg.codigo || leg.code || leg.id;
        
        const matchingPrimary = primaryStocks.find(p => p.omieCode === code);

        if (!matchingPrimary) {
          differences++;
          if (topDifferences.length < 5) topDifferences.push({ type: 'MISSING_IN_PRIMARY', legacyCode: code });
          continue;
        }

        const legQty = Number(leg.quantidade || leg.stockQuantity || leg.quantity) || 0;
        const primQty = Number(matchingPrimary.stockQuantity) || 0;

        if (legQty !== primQty) {
          differences++;
          if (topDifferences.length < 5) {
            topDifferences.push({
              type: 'QUANTITY_MISMATCH',
              code,
              legacyQty: legQty,
              primaryQty: primQty
            });
          }
        }
      }

      // 4. Agregados
      console.log(`[Shadow Read - Stock] Comparison Results: 
      - Total no Legado (API 2): ${totalLegacy}
      - Total Oficial (API 1): ${totalPrimary}
      - Divergências Identificadas: ${differences}`);
      
      if (topDifferences.length > 0) {
        console.log(`[Shadow Read - Stock] Top Divergências (Amostra): ${JSON.stringify(topDifferences)}`);
      }

    } catch (error) {
      console.error('[Shadow Read - Stock] Erro interno durante a execução (ignorado do fluxo):', error);
    }
  }
}
