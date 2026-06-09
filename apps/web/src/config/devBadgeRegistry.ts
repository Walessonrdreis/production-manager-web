export type DomainType = 'api1' | 'api2' | 'mixed' | 'unmapped';

/**
 * Registro centralizado de mapeamento de domínios para o DevBadge.
 * 
 * Isso funciona como um "banco de dados local/mock" em código (TS)
 * exclusivo para controle de fronteiras em tempo de desenvolvimento.
 * 
 * Para atualizar uma página ou bloco:
 * 1. Crie um ID único correspondente (ex: 'nome-da-feature.bloco')
 * 2. Defina o domínio correto: 'api1', 'api2', 'mixed' ou 'unmapped'.
 */
export const devBadgeRegistry: Record<string, DomainType> = {
  // Dashboard
  'dashboard.producedToday': 'api2',
  'dashboard.scheduledToday': 'api2',
  'dashboard.lateSchedules': 'api2',
  'dashboard.pendingOmie': 'api1',
  
  // Stock Rooms
  'stocks.hub': 'mixed',
  'stocks.room': 'mixed',

  // Produção (Production Orders)
  'ops.batch_staging': 'mixed',
  'minhanovapagina.title': 'unmapped',
  'productionordershub.title': 'mixed',
  'card.createorderblock': 'api1',
  'card.openedordersblock': 'api2',
  'card.liveordersblock': 'api2',
  'card.orderreviewblock': 'api2',
  'card.orderhistoryblock': 'api2',
  'card.ordermetricsblock': 'api2',
};

export const getDomainForBadge = (badgeId: string): DomainType => {
  return devBadgeRegistry[badgeId] || 'unmapped';
};
