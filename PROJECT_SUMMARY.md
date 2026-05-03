# Resumo do Projeto: Production Manager
**Versão:** v2.4.0 (Atualizado em 03/05/2026 - Melhoria na Visibilidade de Pedidos no Dashboard)

## 🎯 Objetivo
Sistema de gerenciamento de produção industrial que integra dados da API Omie com funcionalidades locais de planejamento e rastreamento de progresso.

## 🏗️ Arquitetura Técnica (ADR-003 & Guia Operacional)

### 1. Separação de Responsabilidades (Novo)
- **Feature Produção (Controle de Produção):** Criada uma feature dedicada para o rastreamento de itens produzidos (antigo Dashboard). Acompanhada da rota `/production-control`.
- **Feature Dashboard (Estratégico):** O dashboard agora é um espaço reservado para métricas de alto nível e inteligência de dados, desvinculado das operações de checklist diário.

### 2. Otimização e Sincronização de Setores (Final)
- **Restauração da API Real:** Removida a interceptação local (`db.json`) para setores e sincronização. O sistema agora se comunica diretamente com a API de produção (`production-manager-api.onrender.com`).
- **Persistência em IndexedDB:** Implementado cache local robusto usando Dexie (IndexedDB). Os setores são persistidos localmente após cada carregamento bem-sucedido, servindo como fallback instantâneo caso a API esteja lenta ou offline.
- **Sincronização Híbrida:** O botão de sincronização agora tenta acionar o hook da Omie no backend, caindo para um refresh de cache forçado caso o endpoint específico não esteja disponível, garantindo dados sempre atualizados.
- **Cache de Longo Prazo:** Mantidos `staleTime` e `gcTime` no React Query para performance superior em navegação entre telas.

### 2. Gerenciador de Produtos Multi-Setor
- **Vinculação Flexível:** Um único produto agora pode pertencer a múltiplos setores simultaneamente (ex: uma peça que passa por Corte e depois Solda).
- **Acesso Rápido:** O nome de cada setor na listagem agora é um link direto para o gerenciador de produtos vinculados.
- **CRUD e Gestão:** Modal avançado para listagem (R), edição global de metadados (U) e vínculo dinâmico (C/D) de produtos sem afetar outros setores.
- **Migração Transparente:** Sistema de fallback automático que converte dados legados (`sectorId`) para o novo formato de array (`sectorIds`).

### 3. Robustez de Dados SKU
- **Correção de De-para:** Ajustado o `PlanningLogic` para priorizar `product.code` (SKU) sobre o `product.id` (ID interno numeric) durante a geração de ordens de produção.
- **Normalização Expandida:** Incluídos mapeamentos para `codigo_produto_integracao` e múltiplos outros fallbacks no normalizador central.
- **Fail-safe UI:** Implementada lógica de fallback visual `code || id` em todos os componentes de listagem e modais para garantir que o usuário nunca veja campos de identificação vazios.

### 3. Robustez na Integração Omie
- **Normalização de Produtos:** Refatorado o `normalizeProduct` para suportar variações de campos da API Omie (`descricao`, `descr_detalhada`, `description`), garantindo que o nome do produto nunca seja omitido se disponível.
- **Correção Zod Schema:** Removidos valores padrão no nível de infraestrutura que causavam conflitos com a lógica de mapeamento do domínio (Identity vs Infrastructure values).

### 2. Planejamento Multi-Setor
- **Identidade Composta:** Itens de planejamento agora são únicos por `[Código do Produto + ID do Setor]`. Isso permite que o mesmo SKU seja planejado em diferentes etapas produtivas de forma independente.
- **Setor Ativo (UI):** Implementado seletor de setor no cabeçalho do planejamento. Novos itens são automaticamente vinculados ao setor selecionado.
- **Páginas de Trabalho (PDF):** O gerador de PDF agora cria uma página separada para cada setor, incluindo campos para checklists e assinaturas dos responsáveis por etapa.
- **Agrupamento Visual:** Lista de itens selecionados agrupada por setor para melhor conferência da carga de trabalho.

### 2. Feature de Setores (API Real)
- **Migração de Proxy:** Removida a interceptação local do `server.ts` para a rota de setores.
- **Endpoints Admin:** Configurado o uso de `/v1/admin/sectors` para CRUD completo (Create, Read, Update, Delete).
- **Consistência de Dados:** Mantido o padrão de normalização e `Result Pattern` nos usecases de setores.

### 3. Feature de Clientes
- **Persistência Local-First:** Cadastro completo de clientes no IndexedDB (Dexie).
- **Enriquecimento Dinâmico:** Implementado o `CustomerEnricher` que resolve o nome do cliente em pedidos da Omie usando a base local (match via `omieCode`).
- **Navegação:** Adicionado link dedicado na Sidebar e rota protegida `/customers`.

### 4. Governança e Estrutura Modular
- **Guia Operacional:** Implementado o `docs/GUIA_OPERACIONAL.md` com 8 Pilares Arquiteturais definidos.
- **Result Pattern:** 100% dos UseCases e Hooks mutáveis/assíncronos refatorados para o padrão `{ success, data, error }`.
- **Zod-First (Permissivo):** Schemas de validação configurados com `.passthrough()` para garantir que dados de domínio (como `sectorId`) não sejam removidos acidentalmente durante a validação de infraestrutura.
- **Reatividade DEXIE:** Restaurada a reatividade em tempo real nos hooks `usePlanning`, `useMyProducts` e `useLocalProduced` após a refatoração Result, garantindo sincronia instantânea entre IndexedDB e UI.
- **Feedback Visual:** Substituído Toast antigo por `sonner` com suporte a `richColors` e `closeButton`.
- **Integridade de Dados:** O `OrderNormalizer` foi robustecido para suportar tanto a estrutura aninhada do Omie (`detalhe.itens`) quanto a estrutura plana pós-validação.

### 🚀 Próximos Passos (Backlog de Preparação)
1. **Implementar "Optimistic Updates"** nos fluxos do Dashboard (Produção Local).
2. **Refinar a UI do Dashboard** para exibir indicadores de sincronização em tempo real mais granulares.
3. **Expandir Schemas Zod** para cobrir fluxos de Estoque específicos se necessário.
- **Encapsulamento de UI:** Seguindo rigorosamente a ADR 003, as páginas residem em `src/features/<feature>/ui`, com `src/pages` atuando apenas como re-exportadores.
- **Hooks Atômicos:** Organização por feature em `src/hooks`, separando claramente lógica de Query de lógica de Mutation.
### 3. Persistência e Local-First (IndexedDB)
- **Consolidação de Dados:** O sistema utiliza uma única instância do **Dexie.js** localizada em `src/db/index.ts` (versão 5), centralizando as tabelas:
    - `produced`: Rastreamento de progresso de produção.
    - `planning`: Itens selecionados para o planejamento atual.
    - `myProducts`: Catálogo pessoal de produtos selecionados do Omie.
    - `customers`: Base local de clientes.
    - `cache`: Cache de respostas da API para performance offline.
- **Visibilidade de Sincronização:** Implementado o hook `useSyncStatus` e um indicador global no `Topbar` que monitora em tempo real quantos itens locais ainda não foram sincronizados com o servidor original.

### 3. Integração Omie
- **Fluxo de Dados:** Dashboard consome totais da Etapa 20 via API e os cruza com a produção local (`produced`) para calcular o saldo real.

### 2. Stack Tecnológica
- **Frontend:** React 19 + Vite + TanStack Query.
- **Backend/Proxy:** Express.js com persistência local atômica e cache em RAM.
- **Storage Local:** IndexedDB (via Dexie) para grandes volumes de dados no cliente.

### 3. Estrutura de Diretórios (Shape Oficial)
```text
/src
  ├── app/                # Bootstrap e composição global (Router, Providers)
  ├── components/
  │   ├── layout/         # Layouts compartilhados
  │   ├── ui/             # Design System (componentes atômicos)
  │   └── auth/           # Componentes visuais de autenticação
  ├── pages/              # Pontos de entrada das rotas (Re-exports das Features)
  ├── hooks/              # Camada de Hooks Atômicos (Feature-based)
  │   ├── <feature>/      # Hooks específicos (Ex: useDashboardTotals.ts)
  │   └── ...
  ├── services/           # Infra de baixo nível (Client API, Endpoints, Auth Store)
  ├── types/              # Tipos globais
  └── features/           # Núcleo de negócio (Evolução Modular)
      └── <feature>/
          ├── usecases/   # Ações granulares (1 por arquivo)
          ├── domain/     # Regras puras e tipos de domínio
          ├── infra/      # Adapters (API, DB, etc.)
          ├── state/      # Estado local (se necessário)
          ├── ui/         # Views e componentes específicos da feature (Pages)
          └── index.ts    # Interface pública da feature
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
- **Filtro Inteligente:** Busca unificada por Descrição, ID ou **Nome da Família**, com normalização de acentos e insensibilidade a maiúsculas/minúsculas.
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
