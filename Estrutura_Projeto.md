# Mapa de Estrutura do Projeto: Production Manager
**Versão:** v1.7.0 (Atualizado em 29/04/2026)

## 🌳 Árvore de Arquivos (src)

```text
src/
├── app/                        # Configurações globais e infra da aplicação
│   ├── App.tsx                 # Componente raiz que define o tema e estrutura base
│   ├── AuthGuard.tsx           # Proteção de rotas autenticadas
│   ├── ErrorBoundary.tsx       # Captura de erros globais
│   ├── Providers.tsx           # QueryClient, Auth, UI Providers
│   └── Router.tsx              # Definição e gestão de rotas (React Router)
│
├── components/                 # Componentes React reutilizáveis (Shared)
│   ├── auth/
│   │   └── LoginForm.tsx       # Formulário de login
│   ├── layout/
│   │   ├── AppLayout.tsx       # Layout principal com Sidebar e Topbar
│   │   ├── PageContainer.tsx   # Wrapper para conteúdo das páginas
│   │   ├── Sidebar.tsx         # Menu de navegação lateral
│   │   └── Topbar.tsx          # Barra superior com informações do usuário
│   └── ui/                     # Biblioteca interna de componentes atômicos (Baseada em Tailwind)
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
│
├── db/                         # Persistência Local (IndexedDB com Dexie)
│   ├── index.ts                # Configuração do banco, tabelas e esquemas (v3)
│   └── models.ts               # Definição de interfaces dos modelos armazenados
│
├── features/                   # Lógica de negócio modularizada (Clean Architecture Adaptada)
│   ├── auth/                   # Módulo de Autenticação
│   │   ├── index.ts
│   │   ├── usecases/
│   │   └── ui/                 # LoginPage.tsx
│   ├── catalog/                # Catálogo de produtos Omie
│   │   ├── domain/             # Lógica pura e normalização (CatalogNormalizer.ts, CatalogLogic.ts)
│   │   │   └── __tests__/      # Testes unitários de domínio
│   │   ├── infra/              # Acesso a dados/API (CatalogRepository.ts)
│   │   ├── usecases/           # Orquestração (SyncCatalogWithOmie.ts)
│   │   └── ui/                 # Componentes e Páginas (CatalogPage.tsx)
│   ├── dashboard/              # Gestão de produção e metas
│   │   ├── domain/             # Lógica de agregação e cálculos (DashboardLogic.ts)
│   │   │   └── __tests__/      # Testes de totalização e filtros
│   │   ├── infra/              # Repositórios (DashboardRepository.ts, ProducedRepository.ts)
│   │   ├── usecases/           # Fluxos (AddProducedRecord.ts, SyncStage20.ts)
│   │   └── ui/                 # DashboardPage.tsx e componentes atômicos
│   ├── orders/                 # Visualização de pedidos de venda
│   │   ├── domain/             # Normalização de pedidos (OrderNormalizer.ts)
│   │   ├── infra/
│   │   ├── usecases/
│   │   └── ui/                 # OrdersPage.tsx
│   ├── planner/                # Planejamento de produção local
│   │   ├── domain/             # Regras de Upsert e validação (PlanningLogic.ts)
│   │   ├── infra/
│   │   ├── usecases/
│   │   └── ui/                 # PlanningPage.tsx
│   ├── products/               # Gestão de "Meus Produtos" (Favoritos)
│   │   ├── domain/
│   │   ├── infra/
│   │   ├── usecases/
│   │   └── ui/                 # MyProductsPage.tsx
│   └── sectors/                # Gestão de setores industriais
│       ├── domain/             # Cálculos de distribuição (SectorsLogic.ts)
│       ├── infra/
│       ├── usecases/
│       └── ui/                 # SectorsPage.tsx
│
├── hooks/                      # Camada de Hooks Atômicos (Feature-based)
│   ├── auth/
│   │   └── useAuth.ts          # Abstração da store de autenticação
│   ├── catalog/
│   │   ├── useOmieProducts.ts  # Listagem de produtos da Omie
│   │   └── useSyncCatalog.ts   # Mutation para sincronização Omie
│   ├── dashboard/
│   │   ├── useDashboardTotals.ts # Resumo de produção Stage 20
│   │   ├── useLocalProduced.ts   # Gerenciamento de registros offline
│   │   ├── useProducedRecords.ts # Listagem de registros sincronizados
│   │   └── useSyncStage20.ts     # Sincronização de dashboard com remoto
│   ├── orders/
│   │   └── useOrders.ts        # Listagem e cache de pedidos de venda
│   ├── planner/
│   │   ├── useLocalPlanning.ts # Persistência offline de planos
│   │   └── usePlanning.ts      # Orquestração do plano de produção
│   ├── sectors/
│   │   ├── useCreateSector.ts
│   │   ├── useDeleteSector.ts
│   │   ├── useSectors.ts       # Listagem de setores
│   │   └── useUpdateSector.ts
│   └── products/
│       └── useMyProducts.ts    # Gestão de favoritos dos usuários
│
├── services/                   # Motores de comunicação externa
│   └── api/
│       ├── client.ts           # Configuração do Axios (Interceptor/BaseURL)
│       └── endpoints.ts        # Mapa de rotas da API
│
├── sync/                       # Tarefas de background
│   └── produced.sync.ts        # Worker de sincronização de produção offline (Upsert)
│
├── types/                      # Definições globais de tipos TS
│   ├── api.ts                  # Schemas de retorno da API Omie
│   └── index.ts                # Tipos reutilizáveis no domínio do app
│
├── utils/                      # Funções helpers genéricas
│   └── cn.ts                   # Utilitário para merge de classes Tailwind
│
├── main.tsx                    # Ponto de entrada (Entry Point)
└── vite-env.d.ts               # Tipagem de ambiente do Vite
```

## 📐 Governança e Melhores Práticas (Guia Operacional)

1. **Camada de Domínio Puro**: Toda lógica de transformação, cálculo ou filtragem complexa deve residir em `domain/`. Esta camada NÃO conhece APIs ou Banco de Dados.
2. **Testes Obrigatórios**: Mudanças na camada de `domain` devem ser acompanhadas de testes unitários em `__tests__` usando **Vitest**.
3. **Fluxo Unidirecional Clean**:
    - **UI** chama **Hooks**.
    - **Hooks** invocam **UseCases** ou **Queries**.
    - **UseCases** aplicam regras de **Domínio** e persistem via **Repository**.
4. **Resiliência Local-First**: O uso de **Dexie** e workers de **Sync** garante que a operação da fábrica não pare em caso de instabilidade na internet.
5. **Normalização na Origem**: Respostas heterogêneas da API Omie são normalizadas imediatamente no `domain` para garantir tipos consistentes em todo o frontend.

