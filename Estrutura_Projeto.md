# Mapa de Estrutura do Projeto: Production Manager
**Versão:** v1.0.2 (Gerado em 23/04/2026)

## 🌳 Árvore de Arquivos
```text
.
├── backups/               # Cópia de segurança do db.json
├── db.json                # Banco de dados local (JSON)
├── server.ts              # Servidor Express + API Proxy + Local DB Engine
├── PROJECT_SUMMARY.md     # Resumo e arquitetura
├── AGENTS.md              # Regras para agentes de IA
├── Estrutura_Projeto.md   # Este mapa de estrutura
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração Vite
├── scripts/
│   └── update-structure.js # Script de automação deste mapa
└── src/
    ├── main.tsx           # Entry point React
    ├── app/               # Configurações globais
    │   ├── App.tsx
    │   ├── AuthGuard.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── Providers.tsx
    │   └── Router.tsx
    ├── components/
    │   ├── auth/
    │   ├── layout/
    │   │   ├── AppLayout.tsx
    │   │   ├── PageContainer.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── EmptyState.tsx
    │       ├── Input.tsx
    │       ├── Modal.tsx
    │       └── Toast.tsx
    ├── hooks/
    │   ├── api/
    │   │   ├── useDashboard.ts
    │   │   ├── useOrders.ts
    │   │   ├── useProducts.ts
    │   │   └── useSectors.ts
    │   ├── planner/
    │   │   └── usePlanning.ts
    │   └── products/
    │       └── useInventory.ts
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── catalog/
    │   │   └── CatalogPage.tsx
    │   ├── dashboard/
    │   │   └── HomePage.tsx
    │   ├── orders/
    │   │   └── OrdersPage.tsx
    │   ├── planner/
    │   │   ├── PlanningPDF.tsx
    │   │   └── PlanningPage.tsx
    │   ├── products/      # Gestão de produtos
    │   │   └── MyProductsPage.tsx
    │   └── sectors/       # Gestão de Setores (CRUD)
    │       └── SectorsPage.tsx
    ├── services/
    │   ├── api/
    │   │   ├── client.ts
    │   │   └── endpoints.ts
    │   └── auth/
    │       └── authService.ts
    ├── types/
    │   ├── api.ts
    │   ├── index.ts
    │   └── auth.ts
    ├── styles/
    │   └── index.css
    ├── utils/
    │   └── format.ts
    └── main.tsx           # Entry point do React
```
