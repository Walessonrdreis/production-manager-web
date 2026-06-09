/// <reference types="vite/client" />
import { IProductionOrderService } from './contract';
import { FakeProductionOrderService } from './fake.service';
import { RealProductionOrderService } from './real.service';

let instance: IProductionOrderService | null = null;

export const getProductionOrderGateway = (): IProductionOrderService => {
  if (!instance) {
    const useFake = import.meta.env.VITE_USE_FAKE_OP_API === 'true';
    if (useFake) {
      console.warn('⚠️ [ProductionOrder Gateway]: Usando implementação FAKE');
      instance = new FakeProductionOrderService();
    } else {
      console.log('✅ [ProductionOrder Gateway]: Usando implementação REAL');
      instance = new RealProductionOrderService();
    }
  }
  return instance;
};
