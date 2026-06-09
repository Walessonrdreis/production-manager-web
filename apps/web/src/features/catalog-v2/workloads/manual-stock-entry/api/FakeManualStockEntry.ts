import { ManualStockEntryInput, ManualStockEntryOutput, ManualStockEntryVariant } from './ManualStockEntryContract';

export class FakeManualStockEntry implements ManualStockEntryVariant {
  async execute(input: ManualStockEntryInput): Promise<ManualStockEntryOutput> {
    console.log('[FakeManualStockEntry] Executing with input:', input);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (input.quantity <= 0) {
      return {
        status: 'ERROR',
        message: 'A quantidade deve ser maior que zero.'
      };
    }

    if (input.unitValue < 0) {
      return {
        status: 'ERROR',
        message: 'O valor unitário não pode ser negativo.'
      };
    }

    return {
      id: `FAKE_OMIE_MOV_${Math.floor(Math.random() * 100000)}`,
      status: 'SUCCESS'
    };
  }
}
