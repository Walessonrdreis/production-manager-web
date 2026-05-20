# production-control - v1.0.0

## 1. Visão Geral
- **Objetivo**: Fornecer um monitoramento em tempo real (dashboard da Etapa 20), exibindo quais produtos precisam ser produzidos, controle do fluxo de estoque pendente e o agendamento logístico associado. 
- **Rota/Caminho**: `/production-control`
- **Arquivo Principal**: `apps/web/src/features/production/ui/MonitoringPage.tsx`

## 2. Componentes Principais (UI)
- **`MonitoringHeader`**: Exibe o título da página e um botão de ação para realizar a sincronização (Sync Etapa 20) com indicadores visuais de loading.
- **Abas de Navegação (Tabs)**: Alterna entre `Monitoramento` (tela principal) e `Histórico` (tabela de eventos de produção salvos).
- **`MonitoringStats`**: Painel de estatísticas, exibe itens a produzir restantes, SKUs únicos, e o timestamp da última atualização/sincronização.
- **Filtros (Barra de Ações)**: Permite exibir dados com base nos agendamentos: Todos, Para Hoje, Amanhã, Esta Semana, Atrasados.
- **`MonitoringTable`**: Lista completa dos produtos aglomerados, quantidade total demandada contra quantidade produzida, juntamente ao controle rápido de agendamento (datas de planejamento).
- **`MonitoringDetailsModal`**: Modal aberto ao clicar em um Produto na tabela; exibe os pedidos (vendas) específicos que contém esse produto, possibilitando dar "baixa" de produção por pedido individualmente ou para todos de uma vez (Toggle All).
- **`ScheduleEditModal`**: Modal para atribuição e configuração do calendário (Agendamento de Produção) para determinado produto.
- **`ProductionHistoryList`**: Tabela secundária responsável por exibir todos os registros históricos de baixa (Eventos Locais Produzidos).

## 3. Integrações e Hooks (State)
- **`useDashboardTotals`**: Consulta do backend consolidado (API) de totalizadores de produção baseado nos pedidos oriundos da Omie.
- **`useSyncStage20`**: Mutação que desencadeia força de sync (Sincronização manual Stage 20) no backend para rastrear novas vendas.
- **`useOrders`**: Busca a lista global bruta de pedidos (usada cruzada na interface para rastrear qual pedido necessita daquele produto).
- **`useLocalProduced`**: Gerencia o CRUD dos eventos de baixas/produções apontadas pelo operador localmente (armazenadas em banco local via IndexedDB temporariamente / com reflexo visual).
  - *Mutações*: `toggleOrder` (completa um pedido/produto), `toggleAll` (completa um produto em todos pedidos que o contêm).
- **`useProductionSchedules`**: Manipula as datas planejadas para confecção de cada produto.
  - *Mutações*: `setSchedule`, `removeSchedule`.

## 4. Regras de Negócio de Tela (Lógica Local)
- **Cálculo de Quantidade Restante**: A página sempre calcula `A Produzir (totals)` menos `Produzido (histórico local)` por meio da classe `TrackingLogic`. Se todos os pedidos de um item foram baixados, ele não aparece como "Falta Produzir".
- **Comportamento do Filtro "Atrasados"**: Um item é sinalizado como "Overdue" (Atrasado) se a data agendada for anterior a data de hoje, **e** a quantidade produzida não for superior ou igual ao total demandado.
- **Comportamento das Abas (Tabs)**: O usuário escolhe entre gerenciar demandas futuras (Monitoramento) ou observar recibos de preenchimento passado (Histórico). 

## 5. Permissões / Acesso
- **Público / Autenticado**: Usuários logados e autenticados administrativamente (Dashboard Administrativo).

## 6. Histórico de Versões e Observações
- **v1.0.0**: 19/05/2026 - Versão inicial documentada.
- Esta página depende fortemente de processamento complexo em memória (`useMemo`) filtrando arranjos enormes de dados (produtos x pedidos) de duas fontes distintas para gerar métricas de progresso.
- O componente isola regras duras matemáticas usando a domain class `TrackingLogic`, o que mantém o aspecto limpo no arquivo de renderização principal.
