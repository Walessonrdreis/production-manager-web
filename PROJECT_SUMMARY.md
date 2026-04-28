# Resumo do Projeto: Production Manager
**Versão:** v1.5.0 (Atualizado em 28/04/2026 - Conclusão da Migração ADR 003)

## 🎯 Objetivo
Sistema de gerenciamento de produção industrial que integra dados da API Omie com funcionalidades locais de planejamento e rastreamento de progresso.

## 🏗️ Arquitetura Técnica

### 1. Filosofia de Design
- **Arquitetura:** Clean Architecture / Feature-based + Use Cases (ADR 003).
- **Consolidação:** Todas as funcionalidades principais (Auth, Catalog, Dashboard, Orders, Planner, Products, Sectors) foram migradas para a estrutura modular de features.
- **Princípios:** Responsabilidade única, desacoplamento de infraestrutura (Repositórios) e lógica de negócio (UseCases).

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
  ├── pages/              # Páginas (Composição de features e UI)
  ├── hooks/
  │   ├── api/            # Bridges para TanStack Query (delegam para features)
  │   └── ...             # Bridges utilitários
  ├── services/           # Infra de baixo nível (Client API, Endpoints)
  ├── types/              # Tipos globais
  └── features/           # Núcleo de negócio (Evolução Modular)
      └── <feature>/
          ├── usecases/   # Ações granulares (1 por arquivo)
          ├── domain/     # Regras puras e tipos de domínio
          ├── infra/      # Adapters (API, DB, etc.)
          ├── state/      # Estado local (se necessário)
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
