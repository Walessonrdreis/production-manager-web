# Resumo do Projeto: Production Manager
**Versão:** v1.2.1 (Atualizado em 27/04/2026)

## 🎯 Objetivo
Sistema de gerenciamento de produção industrial que integra dados da API Omie com funcionalidades locais de planejamento e rastreamento de progresso.

## 🏗️ Arquitetura Técnica

### 1. Backend (Server-Side)
- **Tecnologia:** Express.js (Node.js) com TypeScript (`server.ts`).
- **Proxy Inteligante:** Intercepta rotas específicas (`/sectors`, `/planning`, `/dashboard/produced`) para persistência local e encaminha o restante para a API Production Manager (Omie).
- **Engine de Banco de Dados Local:**
  - **Cache em Memória:** Todos os dados do `db.json` são mantidos em RAM para performance máxima.
  - **Persistência Assíncrona:** Gravações no disco ocorrem em background.
  - **Escrita Atômica:** Usa arquivos temporários para evitar corrupção de dados.
  - **Sistema de Backups:** Gera backups rotativos (últimos 10) na pasta `/backups` a cada alteração.

### 2. Frontend (Client-Side)
- **Framework:** React 19 + Vite.
- **Gerenciamento de Estado:** TanStack Query (React Query) para sincronização e cache de dados.
- **Estilização:** Tailwind CSS com design focado em usabilidade industrial.
- **Geração de Documentos:** `@react-pdf/renderer` para criação de ordens de produção em PDF.

## 📁 Estrutura de Diretórios e Arquivos
```text
.
├── backups/               # Cópia de segurança rotativa do db.json
├── db.json                # Banco de dados local (JSON)
├── server.ts              # Servidor Express + API Proxy + Local DB Engine
├── PROJECT_SUMMARY.md     # Documentação viva do projeto
├── AGENTS.md              # Regras para agentes de IA
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração do Build
└── src/
    ├── app/               # Configurações globais do app
    │   ├── App.tsx
    │   ├── AuthGuard.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── Providers.tsx
    │   └── Router.tsx
    ├── components/        # Componentes reutilizáveis
    │   ├── auth/          # Login e Guards
    │   ├── layout/        # Navbar, Sidebar, Page Containers
    │   │   ├── AppLayout.tsx
    │   │   ├── PageContainer.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   └── ui/            # Inputs, Botões, Cards, Toasts
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── EmptyState.tsx
    │       ├── Input.tsx
    │       ├── Modal.tsx
    │       └── Toast.tsx
    ├── hooks/             # Hooks customizados
    │   ├── api/           # Integração com API (Query/Mutations)
    │   │   ├── useDashboard.ts
    │   │   ├── useOrders.ts
    │   │   ├── useProducts.ts
    │   │   └── useSectors.ts
    │   ├── planner/       # Lógica do planejador
    │   │   └── usePlanning.ts
    │   └── products/      # Lógica de produtos
    ├── pages/             # Páginas da aplicação
    │   ├── LoginPage.tsx
    │   ├── catalog/       # Catálogo de produtos
    │   ├── dashboard/     # Dashboards de produção
    │   │   └── HomePage.tsx
    │   ├── orders/        # Gestão de pedidos
    │   ├── planner/       # Planejamento e PDF
    │   │   ├── PlanningPDF.tsx
    │   │   └── PlanningPage.tsx
    │   └── sectors/       # Gestão de Setores (CRUD)
    ├── services/          # Serviços de API e Auth
    │   └── api/           # Cliente Axios e Endpoints
    │       ├── client.ts
    │       └── endpoints.ts
    ├── types/             # Definições de Tipos TypeScript
    │   ├── api.ts
    │   └── index.ts
    ├── styles/            # CSS Global e Tailwind
    └── main.tsx           # Entry point do React
```

## 🧠 Lógica de Negócio Principal

### 🔄 Sincronização e Dedução
O sistema realiza uma "mesclagem virtual" de dados:
- O total de itens pendentes vem da **API Externa**.
- O status de "Produzido" é armazenado no **Banco Local**.
- **Cálculo:** `Total Pendente (API) - Total Produzido (Local) = Saldo Real no Dashboard`.

### 📅 Planejamento de Produção
- O planejamento utiliza exclusivamente a lista de **'Meus Produtos'** (itens selecionados no catálogo pelo usuário).
- **Seleção Múltipla:** Suporte para selecionar vários produtos simultaneamente através de checkboxes e adicioná-los em massa à fila de planejamento.
- **Persistência Robusta:** Utiliza **IndexedDB** (via Dexie) para armazenar tanto a lista de produtos salvos quanto os itens selecionados no planejamento, garantindo performance e suporte a grandes volumes de dados.
- Exportação direta para PDF para uso no chão de fábrica.

### 📦 Catálogo e "Meus Produtos"
- **Sincronização:** Consome o catálogo Omie com mapeamento inteligente de campos (Descrição, Código, Família, Estoque, Preço).
- **Dados da Família:** Exibição enriquecida da família do produto em todos os níveis (Catálogo, Meus Produtos e Planejamento).
- **Favoritos:** Permite que cada usuário crie sua lista de trabalho personalizada, persistida no IndexedDB.

### 🏢 Gestão de Setores
- CRUD completo (Criar, Ler, Atualizar, Deletar) para organizar a fábrica por áreas de responsabilidade.

## 🚀 Próximas Melhorias (Roadmap)
- Implementar filtros avançados por setor no Dashboard.
- Adicionar logs de atividades mais detalhados na interface.
- Implementar sistema de notificações para metas de produção atingidas.
