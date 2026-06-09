import { ManualStockEntryVariant } from '../api/ManualStockEntryContract';
import { FakeManualStockEntry } from '../api/FakeManualStockEntry';
import { RealManualStockEntry } from '../api/RealManualStockEntry';

export class ManualStockEntryGateway {
  private static instance: ManualStockEntryVariant;

  static getInstance(): ManualStockEntryVariant {
    if (!this.instance) {
      const useFake = import.meta.env.VITE_USE_FAKE_MANUAL_STOCK_API === 'true';
      if (useFake) {
        console.warn('[ManualStockEntryGateway] Operando em modo SIMULAÇÃO (Fake).');
        this.instance = new FakeManualStockEntry();
      } else {
        console.log('[ManualStockEntryGateway] Operando em modo REAL.');
        this.instance = new RealManualStockEntry();
      }
    }
    return this.instance;
  }
}
