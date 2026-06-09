export interface StockRoom {
  id: string; // Ex: room_raw_materials
  title: string; // Ex: Estoque de Matéria Prima
  description: string;
  iconName: string;
  omieFamilies: string[]; // ['Açúcar', 'Leite', 'Matéria Prima Base']
  devBadgeDomain: 'api1' | 'api2' | 'mixed' | 'unmapped';
}

export interface StockRoomsGateway {
  getRooms(): Promise<StockRoom[]>;
  getRoomById(id: string): Promise<StockRoom | null>;
}
