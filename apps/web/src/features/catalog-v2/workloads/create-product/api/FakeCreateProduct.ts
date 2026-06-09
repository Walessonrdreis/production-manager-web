import { CreateProductInput, CreateProductOutput, CreateProductVariant } from './CreateProductContract';

export class FakeCreateProduct implements CreateProductVariant {
  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    console.log('[FakeCreateProduct] Executing with input:', input);
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (input.codigo === 'ERROR-123') {
      return {
        id: '',
        codigo: input.codigo,
        status: 'ERROR',
        message: 'Simulação de erro na integração com o Omie.'
      };
    }

    return {
      id: `FAKE_OMIE_${Math.floor(Math.random() * 100000)}`,
      codigo: input.codigo,
      status: 'SUCCESS'
    };
  }
}
