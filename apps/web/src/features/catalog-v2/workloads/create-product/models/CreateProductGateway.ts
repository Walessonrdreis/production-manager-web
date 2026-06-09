import { CreateProductVariant } from '../api/CreateProductContract';
import { FakeCreateProduct } from '../api/FakeCreateProduct';
import { RealCreateProduct } from '../api/RealCreateProduct';

export class CreateProductGateway {
  private static instance: CreateProductVariant;

  static getInstance(): CreateProductVariant {
    if (!this.instance) {
      const useFake = import.meta.env.VITE_USE_FAKE_CREATE_PRODUCT_API === 'true';
      if (useFake) {
        console.warn('[CreateProductGateway] Operando em modo SIMULAÇÃO (Fake).');
        this.instance = new FakeCreateProduct();
      } else {
        console.log('[CreateProductGateway] Operando em modo REAL.');
        this.instance = new RealCreateProduct();
      }
    }
    return this.instance;
  }
}
