import { PrismaStocksRepository } from '../../infrastructure/db/PrismaStocksRepository.js';

export class GetStocksUseCase {
  static async execute() {
    return await PrismaStocksRepository.getAll();
  }
}

export class GetStockByIdUseCase {
  static async execute(id: string) {
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

