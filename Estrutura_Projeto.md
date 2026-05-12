# Mapa de Estrutura do Projeto: Production Manager
**Versão:** v2.0.0 (Atualizado em 12/05/2026)

## 🌳 Árvore de Arquivos Principal (Monorepo)

```text
/
├── apps/
│   ├── api/                    # Backend (Node.js/Express)
│   └── web/                    # Frontend (React/Vite)
├── docs/                       # Documentação viva, logs de erros e histórias de implementações
├── scripts/                    # Scripts utilitários globais
└── [Arquitetura base]          # AGENTS2.md, PROJECT_SUMMARY.md, package.json, etc.
```

### 🔹 API (Backend)
```text
apps/api/src/
├── bootstrap
│   ├── app.ts
│   ├── plugins
│   │   ├── database.ts
│   │   ├── error-handler.ts
│   │   ├── job-lock.ts
│   │   ├── jobs.ts
│   │   └── logger.ts
│   ├── routes.ts
│   └── server.ts
├── config
│   ├── env.ts
│   └── index.ts
├── contracts
│   └── example.contract.ts
├── infra
│   └── db.ts
├── legacy
│   ├── db.json
│   ├── db.ts
│   └── local_data.db
├── lib
│   ├── firebase-admin.ts
│   ├── firebase.ts
│   └── http.ts
├── modules
│   ├── auth
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── LoginUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── auth.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── AuthController.ts
│   │           └── routes.ts
│   ├── catalog
│   │   ├── application
│   │   │   └── use-cases
│   │   │       ├── CatalogUseCases.ts
│   │   │       └── SyncCatalogUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── catalog.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── CatalogController.ts
│   │           ├── routes.ts
│   │           └── schemas.ts
│   ├── clients
│   │   ├── __tests__
│   │   │   └── SyncClientsUseCase.test.ts
│   │   ├── application
│   │   │   └── use-cases
│   │   │       ├── GetClientsListUseCase.ts
│   │   │       └── SyncClientsUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── clients.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── ClientsController.ts
│   │           ├── routes.ts
│   │           └── schemas.ts
│   ├── collaborators
│   │   ├── application
│   │   │   └── use-cases
│   │   │       ├── CreateCollaboratorUseCase.ts
│   │   │       ├── DeleteCollaboratorUseCase.ts
│   │   │       ├── GetCollaboratorsUseCase.ts
│   │   │       └── UpdateCollaboratorUseCase.ts
│   │   ├── infrastructure
│   │   │   └── db
│   │   │       └── FirebaseAdminCollaboratorsRepository.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── CollaboratorsController.ts
│   │           └── routes.ts
│   ├── dashboard
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── DashboardUseCases.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── dashboard.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── DashboardController.ts
│   │           └── routes.ts
│   ├── goals
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── GoalsUseCases.ts
│   │   ├── infrastructure
│   │   │   └── db
│   │   │       └── FirebaseAdminGoalsRepository.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── GoalsController.ts
│   │           └── routes.ts
│   ├── orders
│   │   ├── __tests__
│   │   │   └── SyncOrdersUseCase.test.ts
│   │   ├── application
│   │   │   ├── mappers
│   │   │   │   └── OrderMapper.ts
│   │   │   └── use-cases
│   │   │       ├── GetOrdersListUseCase.ts
│   │   │       └── SyncOrdersUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── orders.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── OrdersController.ts
│   │           ├── routes.ts
│   │           └── schemas.ts
│   ├── planning
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── GetPlanningUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── planning.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── PlanningController.ts
│   │           └── routes.ts
│   ├── production
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── ProductionUseCases.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── production.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── ProductionController.ts
│   │           └── routes.ts
│   ├── production-orders
│   │   ├── application
│   │   │   ├── dtos
│   │   │   │   └── ProductionOrderDTO.ts
│   │   │   ├── ports
│   │   │   │   └── IProductionOrderRepository.ts
│   │   │   └── use-cases
│   │   │       ├── CreateProductionOrderUseCase.ts
│   │   │       ├── DeleteProductionOrderUseCase.ts
│   │   │       ├── GetProductionOrdersUseCase.ts
│   │   │       └── UpdateProductionOrderUseCase.ts
│   │   ├── infrastructure
│   │   │   └── db
│   │   │       └── FirebaseAdminProductionOrderRepository.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── ProductionOrdersController.ts
│   │           └── routes.ts
│   ├── proxy
│   │   ├── index.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── ProxyController.ts
│   │           ├── routes.ts
│   │           └── schemas.ts
│   ├── sectors
│   │   ├── application
│   │   │   └── use-cases
│   │   │       └── GetSectorsUseCase.ts
│   │   ├── infrastructure
│   │   │   └── integrations
│   │   │       └── sectors.adapter.ts
│   │   └── presentation
│   │       └── http
│   │           ├── controllers
│   │           │   └── SectorsController.ts
│   │           └── routes.ts
│   └── stocks
│       ├── application
│       │   └── use-cases
│       │       └── StocksUseCases.ts
│       ├── infrastructure
│       │   └── db
│       │       └── StocksRepository.ts
│       └── presentation
│           └── http
│               ├── controllers
│               │   └── StocksController.ts
│               └── routes.ts
├── server.ts
└── shared
    ├── errors
    │   ├── AppError.ts
    │   ├── domain-errors.ts
    │   └── http-errors.ts
    ├── http
    │   ├── response.ts
    │   └── validate.ts
    ├── integrations
    │   └── external
    │       ├── external.adapter.ts
    │       ├── external.client.ts
    │       └── external.utils.ts
    ├── logger
    │   ├── index.ts
    │   └── logger.ts
    └── utils
        ├── backoff.ts
        └── job-lock.ts
```

### 🔹 WEB (Frontend)
```text
apps/web/src/
├── app
│   ├── App.tsx
│   ├── AuthGuard.tsx
│   ├── ErrorBoundary.tsx
│   ├── Providers.tsx
│   └── Router.tsx
├── components
│   ├── auth
│   │   └── LoginForm.tsx
│   ├── layout
│   │   ├── AppLayout.tsx
│   │   ├── PageContainer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── modals
│   │   └── PendingChangesModal.tsx
│   └── ui
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── db
│   ├── index.ts
│   └── models.ts
├── domain
│   └── contracts
│       └── IRepository.ts
├── features
│   ├── auth
│   │   ├── domain
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── ui
│   │   │   └── LoginPage.tsx
│   │   └── usecases
│   │       └── Login.ts
│   ├── catalog
│   │   ├── domain
│   │   │   ├── CatalogLogic.ts
│   │   │   ├── CatalogNormalizer.ts
│   │   │   ├── IProductRepository.ts
│   │   │   └── __tests__
│   │   │       ├── CatalogLogic.test.ts
│   │   │       └── CatalogNormalizer.test.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── CatalogDB.ts
│   │   │   ├── CatalogRepository.ts
│   │   │   └── ProductIndexedDBRepo.ts
│   │   ├── ui
│   │   │   ├── CatalogPage.tsx
│   │   │   └── components
│   │   │       ├── CatalogFilters.tsx
│   │   │       ├── CatalogHeader.tsx
│   │   │       ├── CatalogPagination.tsx
│   │   │       ├── CatalogTable.tsx
│   │   │       ├── SaveToStockModal.tsx
│   │   │       └── SelectionBar.tsx
│   │   └── usecases
│   │       ├── GetOmieProducts.ts
│   │       └── SyncCatalogWithOmie.ts
│   ├── collaborators
│   │   ├── infra
│   │   │   ├── CollaboratorsRepository.ts
│   │   │   └── FirebaseCollaboratorsRepository.ts
│   │   └── ui
│   │       └── CollaboratorsPage.tsx
│   ├── customers
│   │   ├── domain
│   │   │   ├── CustomerEnricher.ts
│   │   │   └── ICustomerRepository.ts
│   │   ├── infra
│   │   │   ├── CustomerSchemas.ts
│   │   │   ├── CustomersRepository.ts
│   │   │   └── FirebaseCustomerRepository.ts
│   │   └── usecases
│   │       ├── DeleteCustomer.ts
│   │       └── SaveCustomer.ts
│   ├── dashboard
│   │   ├── domain
│   │   │   ├── DashboardLogic.ts
│   │   │   ├── ProductionLogic.ts
│   │   │   └── __tests__
│   │   │       ├── DashboardLogic.test.ts
│   │   │       └── ProductionLogic.test.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── DashboardRepository.ts
│   │   │   └── ProducedRepository.ts
│   │   ├── ui
│   │   │   ├── ActivityLogViewer.tsx
│   │   │   └── DashboardPage.tsx
│   │   └── usecases
│   │       ├── AddProducedRecord.ts
│   │       ├── GetProducedRecords.ts
│   │       ├── GetStage20Totals.ts
│   │       ├── MarkProducedAsSynced.ts
│   │       ├── RemoveLocalProduced.ts
│   │       ├── RemoveProducedRecord.ts
│   │       ├── SyncStage20.ts
│   │       ├── ToggleAllProduced.ts
│   │       └── ToggleProducedOrder.ts
│   ├── goals
│   │   ├── domain
│   │   │   ├── Goal.ts
│   │   │   ├── IGoalRepository.ts
│   │   │   └── IGoalsRepository.ts
│   │   ├── infra
│   │   │   ├── FirebaseGoalsRepository.ts
│   │   │   ├── GoalIndexedDBRepo.ts
│   │   │   ├── GoalsDB.ts
│   │   │   └── GoalsRepository.ts
│   │   └── ui
│   │       ├── GoalsManagementPage.tsx
│   │       └── components
│   │           ├── CollaboratorGoalsTab.tsx
│   │           ├── ProductGoalsTab.tsx
│   │           └── SectorGoalsTab.tsx
│   ├── orders
│   │   ├── domain
│   │   │   ├── IProductionOrderRepository.ts
│   │   │   ├── OrderLogic.ts
│   │   │   ├── OrderNormalizer.ts
│   │   │   ├── ProductionOrder.ts
│   │   │   └── __tests__
│   │   │       ├── OrderLogic.test.ts
│   │   │       └── OrderNormalizer.test.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── FirebaseOrderRepository.ts
│   │   │   ├── OrderSchemas.ts
│   │   │   ├── OrdersRepository.ts
│   │   │   └── ProductionOrdersRepository.ts
│   │   ├── ui
│   │   │   ├── OrdersPage.tsx
│   │   │   └── components
│   │   │       ├── OrderDetailsModal.tsx
│   │   │       ├── OrdersHeader.tsx
│   │   │       ├── OrdersTable.tsx
│   │   │       ├── ProductionOrdersTab.tsx
│   │   │       └── SalesOrdersTab.tsx
│   │   └── usecases
│   │       └── GetOrders.ts
│   ├── planner
│   │   ├── domain
│   │   │   ├── PlanningLogic.ts
│   │   │   └── __tests__
│   │   │       └── PlanningLogic.test.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── PlanningDB.ts
│   │   │   ├── PlanningIndexedDBRepo.ts
│   │   │   └── PlanningRepository.ts
│   │   ├── ui
│   │   │   ├── PlanningPDF.tsx
│   │   │   ├── PlanningPage.tsx
│   │   │   └── components
│   │   │       ├── PlanningHeader.tsx
│   │   │       ├── PlanningProductList.tsx
│   │   │       └── PlanningSelectedItems.tsx
│   │   └── usecases
│   │       ├── AddBulkPlanningItems.ts
│   │       ├── AddBulkPlanningItemsRaw.ts
│   │       ├── AddPlanningItem.ts
│   │       ├── AddPlanningItemRaw.ts
│   │       ├── ClearPlanning.ts
│   │       ├── GetPlanningItems.ts
│   │       ├── RemovePlanningItem.ts
│   │       └── UpdatePlanningItem.ts
│   ├── planning
│   │   ├── domain
│   │   │   └── IPlanningRepository.ts
│   │   └── infra
│   │       └── FirebasePlanningRepository.ts
│   ├── production
│   │   ├── domain
│   │   │   ├── IProductionRepository.ts
│   │   │   ├── ProductionLogic.ts
│   │   │   └── TrackingLogic.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── FirebaseProductionRepository.ts
│   │   │   ├── FirebaseScheduleRepository.ts
│   │   │   ├── ProducedRepository.ts
│   │   │   ├── ProductionRepository.ts
│   │   │   └── ScheduleRepository.ts
│   │   ├── ui
│   │   │   ├── MonitoringPage.tsx
│   │   │   └── components
│   │   │       ├── MonitoringDetailsModal.tsx
│   │   │       ├── MonitoringHeader.tsx
│   │   │       ├── MonitoringStats.tsx
│   │   │       ├── MonitoringTable.tsx
│   │   │       ├── ProductionHistoryList.tsx
│   │   │       └── ScheduleEditModal.tsx
│   │   └── usecases
│   │       ├── GetProducedRecords.ts
│   │       ├── GetProductionSchedules.ts
│   │       ├── GetProductionTotals.ts
│   │       ├── MarkProducedAsSynced.ts
│   │       ├── RemoveLocalProduced.ts
│   │       ├── RemoveProductionSchedule.ts
│   │       ├── SetProductionSchedule.ts
│   │       ├── SyncProduction.ts
│   │       ├── ToggleAllProduction.ts
│   │       └── ToggleProducedOrder.ts
│   ├── sectors
│   │   ├── domain
│   │   │   ├── ISectorRepository.ts
│   │   │   ├── SectorsLogic.ts
│   │   │   └── __tests__
│   │   │       └── SectorsLogic.test.ts
│   │   ├── index.ts
│   │   ├── infra
│   │   │   ├── FirebaseSectorRepository.ts
│   │   │   ├── SectorsDB.ts
│   │   │   ├── SectorsIndexedDBRepo.ts
│   │   │   └── SectorsRepository.ts
│   │   ├── ui
│   │   │   └── SectorsPage.tsx
│   │   └── usecases
│   │       ├── CreateSector.ts
│   │       ├── DeleteSector.ts
│   │       ├── GetSectors.ts
│   │       └── UpdateSector.ts
│   └── stocks
│       ├── domain
│       │   └── MyProductsLogic.ts
│       ├── index.ts
│       ├── infra
│       │   ├── ApiMyProductsRepository.ts
│       │   └── ProductSchemas.ts
│       └── ui
│           ├── StocksPage.tsx
│           └── components
│               ├── MyProductsTable.tsx
│               └── ProductDetailsModal.tsx
├── hooks
│   ├── auth
│   │   └── useAuth.ts
│   ├── catalog
│   │   ├── useOmieProducts.ts
│   │   └── useSyncCatalog.ts
│   ├── collaborators
│   │   └── useCollaborators.ts
│   ├── customers
│   │   └── useCustomers.ts
│   ├── dashboard
│   │   ├── useActivityLogs.ts
│   │   ├── useDashboardTotals.ts
│   │   ├── useLocalProduced.ts
│   │   ├── useProducedRecords.ts
│   │   └── useSyncStage20.ts
│   ├── goals
│   │   └── useGoals.ts
│   ├── orders
│   │   ├── useOrders.ts
│   │   └── useProductionOrders.ts
│   ├── planner
│   │   ├── useLocalPlanning.ts
│   │   └── usePlanning.ts
│   ├── production
│   │   └── useProductionSchedules.ts
│   ├── sectors
│   │   ├── useCreateSector.ts
│   │   ├── useDeleteSector.ts
│   │   ├── useSectors.ts
│   │   └── useUpdateSector.ts
│   ├── stocks
│   │   └── useStocks.ts
│   ├── sync
│   │   └── useAutoSync.ts
│   └── ui
│       ├── usePendingDetails.ts
│       └── useSyncStatus.ts
├── lib
│   ├── Result.ts
│   ├── db.ts
│   └── firebase.ts
├── main.tsx
├── mocks
│   ├── browser.ts
│   └── handlers.ts
├── pages
│   ├── LoginPage.tsx
│   ├── catalog
│   │   └── CatalogPage.tsx
│   ├── customers
│   │   └── CustomersPage.tsx
│   ├── dashboard
│   │   └── HomePage.tsx
│   ├── orders
│   │   └── OrdersPage.tsx
│   ├── planner
│   │   └── PlanningPage.tsx
│   ├── production
│   │   └── MonitoringPage.tsx
│   ├── sectors
│   │   └── SectorsPage.tsx
│   └── stocks
│       └── StocksPage.tsx
├── services
│   ├── FirestoreService.ts
│   ├── api
│   │   ├── client.ts
│   │   └── endpoints.ts
│   └── auth
│       └── authService.ts
├── styles
│   └── global.css
├── sync
│   └── produced.sync.ts
├── types
│   ├── api.ts
│   └── index.ts
└── utils
    └── cn.ts
```

## 📐 Governança e Melhores Práticas (Guia Operacional)

1. **Arquitetura Monorepo**: O projeto está perfeitamente segmentado entre `/apps/api` e `/apps/web`. Modificações não devem quebrar o isolamento deles, toda comunicação é via `apiClient`.
2. **Camada de Domínio Puro**: Toda lógica de transformação, cálculo ou filtragem complexa deve residir em `domain/`. Esta camada NÃO conhece APIs ou detalhes de Framework.
3. **Padrão de Respostas (Result Pattern)**: UseCases e Serviços devem retornar `{ success: boolean, data?: T, error?: string }` para lidar com falhas explicitamente.
4. **Resiliência com Optimistic UI**: O frontend garante a responsividade atualizando caches localmente e então realizando o sync (ex: migração de indexDB offline para Nuvem em features refatoradas).
5. **Documentação Viva e Histórico**: `agentes/AI` são obrigados a manter `PROJECT_SUMMARY.md` atualizado e preencher `docs/BUGS` e `docs/imprementacoes/` sempre que um erro for corrigido ou feature concluída.

