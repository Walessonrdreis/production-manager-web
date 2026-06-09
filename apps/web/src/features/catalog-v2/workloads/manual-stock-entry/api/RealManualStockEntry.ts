import { ManualStockEntryInput, ManualStockEntryOutput, ManualStockEntryVariant } from './ManualStockEntryContract';

export class RealManualStockEntry implements ManualStockEntryVariant {
  async execute(input: ManualStockEntryInput): Promise<ManualStockEntryOutput> {
    try {
      // Calls the API 1 endpoint that handles Omie stock entries
      const response = await fetch('/api/stock/manual-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        let errorMsg = 'Falha ao registrar movimento na API';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch {
          // ignore
        }
        return {
          status: 'ERROR',
          message: errorMsg
        };
      }

      const data = await response.json();
      return {
        id: data.id,
        status: 'SUCCESS'
      };
    } catch (error) {
      console.error('[RealManualStockEntry] Falha de comunicação', error);
      return {
        status: 'ERROR',
        message: 'Falha de comunicação com o servidor. Tente novamente mais tarde.'
      };
    }
  }
}
