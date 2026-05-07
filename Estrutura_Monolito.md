# Mapa de Estrutura Monolito: Production Manager
**Versão:** v1.0.0 (Atualizado em 07/05/2026)

Esta estrutura representa a convergência do projeto para um Monorepo, separando a aplicação Cliente (Web) da API de Negócio (Backend).

## 🌳 Árvore de Diretórios (Monolito)

```text
/
├── apps/
│   ├── web/                     # Aplicação Frontend (React + Vite)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/             # Bootstrap global (Providers, Router)
│   │   │   ├── components/      # UI Shared e Layout
│   │   │   ├── db/              # IndexedDB (Dexie) persistence
│   │   │   ├── features/        # Módulos de negócio (Clean Architecture)
│   │   │   │   ├── auth/
│   │   │   │   ├── catalog/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── orders/
│   │   │   │   ├── planner/
│   │   │   │   ├── products/
│   │   │   │   └── sectors/
│   │   │   ├── hooks/           # Hooks React (Feature-based)
│   │   │   ├── services/        # Clientes de API (Axios)
│   │   │   ├── sync/            # Workers de sincronização
│   │   │   ├── types/           # Tipagem global
│   │   │   └── utils/           # Helpers genéricos
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                     # Backend API (Express + Clean Architecture)
│       ├── dist/                # Build output
│       ├── docs/                # Documentação técnica e templates
│       │   ├── prompts/
│       │   ├── templates/
│       │   │   └─ module/       # Template para novos módulos
│       │   └── typedoc/
│       ├── db/                  # Persistência e Migrações
│       │   ├── migrations/
│       │   ├── seeds/
│       │   └── schema/
│       ├── scripts/             # Automações e métricas
│       ├── tests/               # Testes de integração/E2E
│       ├── src/
│       │   ├─ bootstrap/        # Inicialização do servidor e plugins
│       │   │  ├─ plugins/       # Logger, Error Handler, Database
│       │   │  ├─ app.ts
│       │   │  ├─ routes.ts
│       │   │  └─ server.ts
│       │   ├─ config/           # Variáveis de ambiente
│       │   ├─ contracts/        # Contratos de interface global
│       │   ├─ infra/            # Conexões base (DB Client)
│       │   ├─ legacy/           # Código em processo de refatoração
│       │   ├─ lib/              # Utilitários de baixo nível
│       │   ├─ shared/           # Erros e utilitários comuns
│       │   ├─ modules/          # Domínios de negócio (Bounded Contexts)
│       │   │  └─ name_module/
│       │   │     ├─ application/    # DTOs, Ports, Use-Cases
│       │   │     ├─ infrastructure/ # Repositories, Jobs, Integrations
│       │   │     └─ presentation/   # Http (Controllers, Routes, Schemas)
│       │   └─ server.ts         # Entry point alternativo
│       └── package.json
│
├── packages/                    # Pacotes compartilhados (Shared Libs)
│   └── contracts/               # Tipos e Schemas Zod compartilhados Web/API
│
├── package.json                 # Workspaces e scripts globais
└── turbo.json                   # Configuração de Pipeline (Monorepo)
```

## 📐 Diretrizes de Coexistência

1. **Contratos Primeiro (Contract-First):** Mudanças no esquema de dados devem ser refletidas primeiro em `packages/contracts` antes de serem implementadas em `apps/api` ou consumidas em `apps/web`.
2. **Sincronia de Tipos:** O frontend deve importar tipos e validações Zod do pacote shared para garantir que o "Contrato" seja respeitado sem duplicação de código.
3. **Desacoplamento:** O domínio de `apps/web` e `apps/api` deve ser espelhado, facilitando a migração de lógicas de "Cálculo no Cliente" para "Cálculo no Servidor" quando necessário.
