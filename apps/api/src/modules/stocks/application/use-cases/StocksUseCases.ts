import { StocksRepository } from '../../infrastructure/db/StocksRepository.js';

export class GetStocksUseCase {
  static async execute() {
    return await StocksRepository.getAll();
  }
}

export class GetStockByIdUseCase {
  static async execute(id: string) {
    return await StocksRepository.getById(id);
  }
}

export class SaveStockUseCase {
  static async execute(id: string, data: any) {
    return await StocksRepository.save(id, data);
  }
}

export class DeleteStockUseCase {
  static async execute(id: string) {
    return await StocksRepository.delete(id);
  }
}
