import { StockRoom, StockRoomsGateway } from '../domain/StockRoomGateway';

export const MOCK_STOCK_ROOMS: StockRoom[] = [
  {
    id: 'room_raw_materials',
    title: 'Estoque de Matéria Prima',
    description: 'Açúcar, Leite em pó e bases genéricas.',
    iconName: 'Wheat',
    omieFamilies: ['Matéria Prima', 'Açúcar', 'Leites e Derivados'],
    devBadgeDomain: 'mixed'
  },
  {
    id: 'room_packaging',
    title: 'Estoque de Embalagens',
    description: 'Caixas, rótulos, fitas e papelão.',
    iconName: 'Package',
    omieFamilies: ['Embalagem', 'Rótulo', 'Papelão'],
    devBadgeDomain: 'mixed'
  },
  {
    id: 'room_finished_goods',
    title: 'Produtos Finalizados',
    description: 'Barras prontas, trufas e kits.',
    iconName: 'ShoppingBag',
    omieFamilies: ['Barras Naturais', 'Trufas', 'Kits de Presente', 'Edições Comemorativas'],
    devBadgeDomain: 'mixed'
  },
  {
    id: 'room_cocoa',
    title: 'Estoque de Amêndoa de Cacau',
    description: 'Insumo base e especial.',
    iconName: 'Sprout',
    omieFamilies: ['Amêndoa Seca', 'Cacau Fino', 'Amêndoa Torrada'],
    devBadgeDomain: 'mixed'
  },
  {
    id: 'room_inclusions',
    title: 'Estoque de Inclusões',
    description: 'Castanhas, frutas secas, flocos, etc.',
    iconName: 'Nut',
    omieFamilies: ['Inclusões', 'Castanhas', 'Frutas Secas'],
    devBadgeDomain: 'mixed'
  },
  {
    id: 'room_dml',
    title: 'Estoque DML',
    description: 'Materiais de limpeza, EPIs e descartáveis.',
    iconName: 'Brush',
    omieFamilies: ['Materiais de Limpeza', 'EPI', 'Descartáveis', 'Uso e Consumo'],
    devBadgeDomain: 'mixed'
  }
];

export class FakeStockRoomsGateway implements StockRoomsGateway {
  async getRooms(): Promise<StockRoom[]> {
    return MOCK_STOCK_ROOMS;
  }

  async getRoomById(id: string): Promise<StockRoom | null> {
    const room = MOCK_STOCK_ROOMS.find(r => r.id === id);
    return room || null;
  }
}
