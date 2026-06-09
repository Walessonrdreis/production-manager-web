import { CreateProductInput, CreateProductOutput, CreateProductVariant } from './CreateProductContract';

export class RealCreateProduct implements CreateProductVariant {
  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    try {
      // Calls the API 1 endpoint that handles Omie synchronization
      const response = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        let errorMsg = 'Falha ao criar produto na API';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch {
          // ignore
        }
        return {
          id: '',
          codigo: input.codigo,
          status: 'ERROR',
          message: errorMsg
        };
      }

      const data = await response.json();
      return {
        id: data.id || '',
        codigo: input.codigo,
        status: 'SUCCESS'
      };
    } catch (error) {
      console.error('[RealCreateProduct] Falha de comunicação', error);
      return {
        id: '',
        codigo: input.codigo,
        status: 'ERROR',
        message: 'Falha de comunicação com o servidor. Tente novamente mais tarde.'
      };
    }
  }
}
