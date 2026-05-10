# Resumo do Projeto: Production Manager
**Versão:** v4.8.1 (Atualizado em 10/05/2026 - Evolução de Produtos e Setores)

## 🎯 Objetivo
Sistema de gerenciamento de produção industrial que integra dados da API Omie com funcionalidades locais de planejamento, rastreamento de progresso e gestão de metas. Arquitetura 100% nativa de nuvem com Google Firebase.

---

## 🏗️ Arquitetura Técnica (ADR-004 & Guia Operacional)
### 0.7. Renovação do Dashboard Estratégico (v4.8.1 - Atual)
- **Configuração de Estoque Mínimo e em Lote (Em Lote):** Adicionada funcionalidade de atribuir estoque mínimo a vários produtos simulaneamente em `MyProductsPage`, utilizando checkboxes e um modal flutuante com a funcionalidade de "Ações em Massa".
- **Configuração de Estoque Mínimo:** Adicionado botão/input inline no painel de "Inventário & Demanda" do `ProductDetailsModal`, garantindo que os usuários possam ajustar rapidamente o estoque mínimo de cada produto e atualizar em tempo real a situação de "Déficit" ou "Atenção".
- **Filtros Avançados em Meus Produtos (v4.8.1):** Adicionada funcionalidade de filtragem por "Família" e "Setor" na página de Meus Produtos, permitindo reduzir o campo de visão do usuário quando existem dezenas/centenas de produtos cadastrados.
- **Bloqueio de Exclusão de Setores (v4.8.1):** Firmada regra de negócio onde Setores não podem ser excluídos da plataforma, existindo apenas como entidades perenes (edição/criação), a fim de evitar corrupção e desassociação não rastreada no fluxo multiponto de produtos.
- **Novos KPIs Diretos:** O `DashboardPage` foi renovado para exibir indicadores reais da produção utilizando os hooks já disponíveis (`useLocalProduced`, `useProductionSchedules`, `useDashboardTotals`), entregando acompanhamento em tempo real alinhado à estratégia. Agregadores de "Produzidos Hoje", "Programados para Hoje", "Atrasos" e "Pendente Geral (Omie)" fornecem clareza extrema sobre os gaps imediatos no chão de fábrica e dão o match direto para a tela de Acompanhamento.
- **Unificação de Metas no Modal:** Implementada a funcionalidade de "Metas de Produção" diretamente no modal de detalhes do produto (`ProductDetailsModal`). Agora é possível visualizar, criar, editar e excluir objetivos diários, semanais e mensais do SKU direto do modal, agilizando o gerenciamento sem necessidade de mudar de tela.
- **Conexão Multiponto Setor-Produto:** Produtos favoritados ("Meus Produtos") agora ganharam a capacidade de armazenar e designar *vários* Setores em sua matriz por meio do novo quadro "Roteiro de Produção" no `ProductDetailsModal`. Além disso, a tabela "Meus Produtos" agora renderiza os badges de cada setor com o que o item está vinculado.
- **Confirmação de Exclusão Segura:** Todos os botões de delete no fluxo de Meus Produtos (excluir linha da tabela, botão "Limpar Tudo" e botão de excluir Metas no Modal) agora invocam um `ConfirmDialog` de segurança genérico, prevenindo exclusões acidentais com visual de alerta padrão.

- **Visão de Demanda vs Estoque:** A tabela "Meus Produtos" e o Modal passam a exibir a "Demanda Pendente" (calculada em tempo real com base nos pedidos ativos), confrontando com o "Estoque Atual" e identificando em qual situação se encontra o SKU (Déficit, Atenção ou Seguro).
- **Alertas Visuais Estratégicos:** Linhas da tabela com déficit de estoque agora são destacadas em cores (vermelho para déficit imediato, amarelo para atenção quando estoque atinge mínimo) e ícones de alerta para clareza visual imeditada.
- **Ação "Adicionar ao Planejamento":** Botão "Planejar Produção" implementado direto nas linhas da tabela de "Meus Produtos" e no Modal de Detalhes, otimizando o fluxo de planejamento e criação rápida de lotes.
- **Identificador e Trigger de Sincronização:** O Topbar agora processa dinamicamente a conexão e o status das atualizações com um feedback de `"Sincronizado há X min"`. Um botão de re-sincronização forçada chama ativamente os Repositórios de Produtos e Pedidos para manter o offline-first sempre fresco.

### 0.6. Redesign de "Meus Produtos" (v4.7.0)
- **Tabela de Visualização e Modal de Detalhes:** A visualização de "Meus Produtos" que funcionava em cards foi alterada para um layout em tabela (`MyProductsTable`). Isso possibilita escalar o planejamento e visualizar saldos atualizados de forma otimizada. Quando o item é selecionado, um modal contendo todos os detalhes do produto mapeados pela API Omie (`ProductDetailsModal`) é revelado.

### 0. Refatoração da API Backend
- **Limpeza de Base Legada (v4.5.2):** Movidos os arquivos remanescentes e não mais utilizados de persistência locais (como o antigo `db.ts` SQLite localizado na pasta raiz `/server`) diretamente para dentro de `apps/api/src/legacy/`, consolidando e unificando arquivos na arquitetura corporativa da API backend e limpando o diretório raiz do projeto.
- **Conclusão e Padronização da Etapa 5 (v4.5.1):** As violações arquiteturais nos novos submódulos (`products`, `orders`, `clients`) foram corrigidas seguindo os Pilares Arquiteturais (AGENTS.md). As chamadas ao `axios` (API Onrender) foram movidas para classes `Adapter` em `infrastructure/integrations/`. Toda a lógica embarcada nos `controllers` (inclusive mapeamentos pesados em `OrdersController`) foi abstraída e realocada para `Use Cases` na camada de `application`. Implementou-se um tratamento global de erros robusto e tipado (via `AppError`) acionado pelos controllers que, por sua vez, devolvem `HttpResponseBuilder`. Ademais, foram gerados testes unitários com Vitest para todos os `UseCases` implementados (100% TDD na camada Application). No lado cliente, a mesma reestruturação corrigiu um teste preexistente em CatalogNormalizer que falhava devido ao envelhecimento nos mapeamentos falsos (Mocks).
- **Estruturação Modular (Etapa 5 - v4.5.0):** Com a base do Express extraída com segurança, os endpoints originais de sincronização agrupados debaixo do `/proxy` (`syncProducts`, `syncOrders`, e `syncClients`) foram desmembrados em novos submódulos autônomos (`modules/products`, `modules/orders`, e `modules/clients`), possuindo seus próprios `controllers` e `routes`. A base url no frontend (`SERVICES_URL`) foi configurada para `/api/` (em vez de `/api/proxy/`) com endpoints genéricos sendo roteados adequadamente sob `/proxy/` para fallback no proxy, e as rotas extraídas registradas com sucesso e limpas no novo standard.
- **Rápida Migração Autônoma Completa (Etapa 6 - v4.6.0):** Eliminado o roteamento genérico `/proxy` remanescente de `endpoints.ts`. Foram criados os diretórios para as novas features (`Dashboard`, `Sectors`, `Planning`, `Goals`, `Production` e `Auth`), seguindo o modelo ajustado em `Orders` com: Adapters isolados que fazem as requisições, UseCases controlando a chamada e Controllers tipados disparando resposta através do `HttpResponseBuilder`. Removido o prefixo `/proxy` do frontend que passa a apontar diretamente para os novos submódulos autônomos da API local.
- **Correção do Catálogo Omie (v4.4.5):** O repositório do Catálogo consumia `FirebaseProductRepository` (destinado a "Meus Produtos") como short-circuit, fazendo com que o catálogo `/products` exibisse apenas itens que o usuário tinha salvo internamente. Esta lógica errônea foi removida. A página de Catálogo agora puxa fielmente todos os itens paginados diretamente da API Omie, atendendo ao requisito de visualização integral da base. Adicionalmente, também foi evitado que paginações do Catálogo fossem salvas indevidamente em "Meus Produtos".
- **Estruturação Modular (Etapa 3 - v4.4.3):** Isolamento total da criação do Express App e do Bootstrapping. A inicialização da configuração do Express foi extraída para `apps/api/src/bootstrap/app.ts` usando padronização do Error Handler e de HTTP Response patterns (`apps/api/src/shared/errors/AppError.ts`, `apps/api/src/shared/http/response.ts` e `apps/api/src/bootstrap/plugins/error-handler.ts`). A lógica de Listening / Vite middleware proxy foi movida para `apps/api/src/bootstrap/server.ts`. O core file `/server.ts` na raiz agora atua exclusivamente como entrypoint estático importando o env start e o server bootstrap. 
- **Estruturação Modular (Etapas 1 e 2 - v4.4.0 e v4.4.1):** Migração do código do proxy contido no `server.ts` para a nova arquitetura padrão dentro de `apps/api/`, organizando as funções antigas em controllers e rotas (`ProxyController`). A lógica de inicialização de variáveis de ambiente (`dotenv`) e as configurações globais de Node (`process.setMaxListeners`) agora encontram-se encapsuladas em `apps/api/src/config/env.ts` e as rotas são roteadas via `apps/api/src/bootstrap/routes.ts`. A funcionalidade original foi mantida de forma íntegra. Em (v4.4.1) foi corrigido o bug 404 ao atualizar de `router.all('*')` para `router.use('/')` no módulo proxy.

### 0.5. Atualização de Sincronização e Refresh via Cron Job (v4.6.6 - Atual)

### Criação do Módulo de Colaboradores (Nova Funcionalidade - Etapas 1 e 2)
- **Backend API (v4.8.2):** Para suportar a nova gestão de colaboradores e metas dependentes das equipes, foi implementado o módulo completo de `collaborators` na API (`apps/api/src/modules/collaborators/`). Esse módulo inclui UseCases (`Get`, `Create`, `Update`, `Delete`), Controller e Rotas devidamente cadastradas no `bootstrap`. A persistência segue a arquitetura cloud optando pelo `FirebaseAdminCollaboratorsRepository` e, como fallback da estrutura legada, a representação da tabela em `legacy/db.ts`.
- **Frontend App (v4.8.3):** Criada a interface de visualização da equipe em `CollaboratorsPage`, contendo a tabela de apresentação, badges dinâmicos em relação a Setor e Status (Ativo/Inativo), modais para cadastro e edição rápida e deleção segura através de `ConfirmDialog`. O estado global reativo da página foi encapsulado no hook modular `useCollaborators` (react-query), além de possuir seu repositório integrado `CollaboratorsRepository` e camada offline (Firebase).

- **Background Sync a cada 10 min:** Foi implementado no bootstrap da API (node-cron) a execução contínua `startBackgroundJobs()` que atualiza os dados do Render e sincroniza nativamente com o Firebase (para Pedidos e Produtos). O Job e rotas do módulo de Clientes foram desativados temporariamente visto que a rota `admin/orders/stage20/enriched` já traz os dados enriquecidos de Clientes.
- **Backend Driven Sync:** As requisições de Front-end (ex: `OrdersRepository.syncWithOmie`) não fazem mais o upload local para o Firebase. A API chama e processa a lógica de UseCase onde os dados são mapeados num Batch Write super rápido salvando em `orders`, `products`, e `customers` com timestamps automatizados.
- **Cache Busting e Limites de Batch:** Adicionado verificação de paginação em loop infinito travada em N páginas para puxar todos os registros de tabelas na Omie (Orders / Clients / Products) sem ficar restrito à página 1. Além disso, adicionado `_t: timestamp` para ignorar o cache da API do onRender e forçar o re-fetch. Os inserts do Firebase Admin agora ocorrem em blocos (chunks) de 400 em 400 registros para evitar o estouro de limite de 500 operações por Batch.
- **Sincronização Bidirecional (Upsert & Delete):** A lógica de fetch para Firebase Admin nos UseCases (`SyncOrdersUseCase`, `SyncProductsUseCase`, `SyncClientsUseCase`) agora captura os IDs vigentes da Omie e, ao fim do `upsert` em lote, compara com os IDs atualmente salvos no Firebase, removendo (`delete`) quaisquer arquivos obsoletos ("fantasmas") que não existam mais na API.
- **Correção Endpoint Admin Orders e Memory Leak:** Ajuste na URL de consumo do `/v1/admin/orders/stage20/enriched` (trazendo informações enriquecidas do cliente) limitando `pageSize=200`, além da correção do limit de EventEmitter resolvendo o bug do `MaxListenersExceededWarning` injetando `setMaxListeners` apropriados pelo `externalClient`.

### 0.5. Refatoração de Sincronização (v4.3.0)
- **Persistência Exclusiva e Direta no Firebase:** As operações em "Meus Produtos" (`/my-products`) e "Controle de Produção" (`/production-control`) foram completamente migradas para utilizarem SOMENTE o Firebase API. Nenhuma requisição (`POST`, `PUT`, `DELETE`) de lógica de negócios ou cruds é enviada para a API do Render nas funcionalidades correspondentes, simplificando as mutações e aumentando a agilidade das transações off-line/local-first apoiadas pelo Firestore.
- **Rastreabilidade Visual de Produção:** Ao marcar um pedido como "Produzido", um modal de confirmação protege contra remoção acidental. O rastreio agora indica localmente a data exata e a hora em que aquela finalização ocorreu (via `updatedAt`).

### 0.5. Migração para Firebase (v4.2.1)
- **Firebase Infrastructure:** Adicionada camada de persistência em nuvem robusta com **Google Cloud Firestore**.
- **Segurança de Dados Reforçada:** As regras `firestore.rules` foram ajustadas para lidar com faltas de permissão (Missing or insufficient permissions) nas coleções cruciais, resolvendo bloqueios nas listagem de pedidos.
- **Acesso Prioritário ao Firebase:** Modificada a mecânica de todas as listagens para priorizarem sempre a leitura do backend Cloud Firestore. Caso omissos, eles buscam da API de Integração e performam caching local através de `.saveMany()`.
- **Prevenção de Errors Uncaught:** Removida a obrigatoriedade de ID nos inserts em massa e blindados the `FirestoreService.ts`.
- **Zustand & Firebase:** Atualizamos `useAuthStore` e implementamos autologin silencioso.
- **Blueprint de Dados:** Criado `firebase-blueprint.json` mapeando entidades.

### 1. Persistência de Dados Local (SQLite - v4.0.12)
- **Consolidação SQLite:** Dados anteriormente em arquivos JSON foram migrados para o banco `/data/local_storage.sqlite`.
- **Otimização Exclusão em Lote (Bulk Delete) (v4.0.7):** Correção do botão "Limpar Tudo" na página Meus Produtos. Substituído loop manual assíncrono problemático que travava a API, por endpoint único otimizado `DELETE /admin/products` garantindo que os itens não voltem mais com o unmount/mount.
- **Correção de Persistência em Produção (v4.0.6):** Atualizadas as tabelas `produced` e `schedules` no SQLite e endpoints do proxy em `server.ts` para capturarem e salvarem os campos corretos emitidos pelo frontend na tela de `/production-control` (`orderId`, `orderNumber` e `scheduledAt` agora são devidamente persistidos sem serem descartados).
- **Correção de Reversão de Edição (v4.0.5):** Resolvido problema em Repositórios Locais (Sectors e Products) onde edições não eram enviadas para o servidor se o item estivesse ausente no `IndexedDB`, causando reversão visual após invalidação do cache. Não usamos mais `db.json`.
- **CRUD e Validações Adicionais:** Telas e modais de Metas de Produção com confirmações contra deletes por acidentes, bem como navegação por abas para categorizar Diárias, Semanais e Mensais.
- **Vantagens:** Melhor performance em buscas complexas, integridade referencial e suporte a transações bulk.
- **Tabelas Implementadas:** `sectors`, `products` (híbrido Omie + Local), `orders`, `planning`, `goals`, `produced` e `schedules`.

### 2. Sincronização e Hibridismo (Omie Sync & Configuração em Background - v4.0.1)
- **Sincronização Contínua Automática:** Itens com flag `synced: false` no IndexedDB agora são sincronizados automaticamente a cada 10 segundos chamando os endpoints do servidor com as alterações pendentes de catálogo, planejamento, produção, setores e metas de forma granular. Ícones reagem instantaneamente a essa sincronização.
- **Cache Local da API:** Páginas que consomem dados externos (Produtos e Pedidos) agora possuem uma camada de cache no SQLite para leitura em fallback.
- **Botão Sincronizar na Dashboard:** Aciona endpoints `/admin/omie/sync/*` que buscam dados frescos do Omie.
- **Extensibilidade Local:** É possível associar dados puramente locais (como 'Setores') a objetos vindos da API diretamente no banco SQLite.

### 3. Gestão Total (Proxy vs SQLite)
- **Interceção de Proxy:** O `server.ts` intercepta as chamadas locais dependendo das flags `VITE_USE_LOCAL_*` e as processa usando consultas SQL (SELECT, INSERT, UPDATE, DELETE).
- **Tratamento de Booleans:** A camada local IndexedDB utiliza booleanos `true/false`, que são perfeitamente normalizados no SQL via `1/0` para a flag `synced` no proxy.

### 2. Transparência de Sincronização (v3.4.2)
- **Modal de Pendências:** Implementado um modal detalhado que pode ser acessado ao clicar no indicador de sincronização no `Topbar`.
- **Informação Contextual:** O modal exibe exatamente quais registros de Produção, Planejamento, Catálogo ou Setores estão salvos apenas localmente (unsynced), oferecendo maior segurança ao usuário sobre o estado dos seus dados Offline-First.

### 3. Gestão de Metas de Produção (v3.1.0)
- **Feature Goals:** Implementada a funcionalidade para definir objetivos numéricos (Metas) por SKU.
- **Relacionamento com Produtos:** As metas são vinculadas ao `productCode` (SKU) do catálogo "Meus Produtos", garantindo integridade entre planejamento e objetivos.
- **Persistência Isolada:** Utiliza o novo `GoalsDB` (IndexedDB) para armazenamento local, permitindo operação offline e resiliência.
- **Validações:** Impede a criação de metas duplicadas para o mesmo SKU no mesmo período (Diário, Semanal, Mensal).
- **Acesso:** Nova rota `/goals` e ícone de "Atividade" na barra lateral.

### 2. Evolução da Persistência (IndexedDB Modular)
- **Bancos Independentes:** Migração completa do banco monolítico `ProductionManagerDB` para bancos especializados, aumentando a escalabilidade e reduzindo a concorrência:
    - `CatalogDB`: Gerenciador de produtos salvos (favoritos).
    - `SectorsDB`: Gestão de setores e seus vínculos com produtos.
    - `PlanningDB`: Gerenciador de lotes e itens de planejamento.
    - `GoalsDB`: Armazenamento de metas de produção.
- **Migração Transparente e Resiliente:** Implementados `ensureMigration` gateways em todos os repositórios.
    - **Correção de Loop Infinito:** Adicionada uma tabela `config` em cada banco modular para rastrear o status da migração (`migration_done`). Isso evita que o sistema re-importe dados legados caso o usuário delete todos os registros de uma nova tabela (resolvendo o bug onde setores deletados reapareciam).
- **Reatividade Garantida:** Atualização dos hooks `useMyProducts` e `usePlanning` para garantir que a migração ocorra de forma transparente ao usuário sem perder a reatividade do `useLiveQuery`.

### 3. Ajustes de Identidade e SKUs
- **Priorização de ID:** Ajustada a lógica de seleção de produtos para usar o `id` interno (Dexie) para navegação e `code` (SKU) para lógica de negócio e exportação, resolvendo conflitos em listas de seleção.
- **Normalização de Campo:** Padronização do uso de `productCode` em todos os novos modelos (`PlanningItem`, `ProductionGoal`, `ProductionSchedule`).

### 4. Separação de Responsabilidades
- **Feature Produção (Controle de Produção):** Criada uma feature dedicada para o rastreamento de itens produzidos (antigo Dashboard). Acompanhada da rota `/production-control`.
- **Programação de Produção (CRUD Completo):** 
  - **Create/Update:** Possibilidade de atribuir e editar datas de produção e observações detalhadas para cada item.
  - **Relacionamento com Planejamento:** Integração automática; ao planejar itens na aba "Planejamento", as datas de produção são automaticamente sincronizadas com o "Controle de Produção".
  - **Read:** Visualização clara de prazos na tabela com badges de status (Atrasado, Hoje, Futuro).
  - **Delete:** Opção de remover a programação de um item específico.
  - **Persistência Móvel:** Dados salvos localmente via IndexedDB para resiliência.
- **Gestão de Prazos:** Filtros inteligentes por período (Hoje, Amanhã, Semana) e alertas visuais para itens em atraso (past-due).

### 2. Dashboard Estratégico (Novo)
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

### 3. Feature de Clientes (v4.0.8 e v4.0.9)
- **Integração Plena com API (v4.0.8):** O repositório de clientes foi migrado de ser puramente local (IndexedDB) para ser Híbrido, consumindo diretamente o endpoint `v1/clients` da API remota.
- **Sincronização em Lote e Paginação (v4.0.9):** Sincronização offline-first aprimorada, iterando nativamente sobre todas as páginas do endpoint API até a última e cacheando os dados com segurança. Adicionado paginação (20 itens/página) nativa na UI da tela de Clientes para evitar travamento da renderização/DOM em bases com milhares de registros.
- **Navegação:** Adicionado link dedicado na Sidebar e rota protegida `/customers`.
- **Ordens para v1/orders (v4.0.10):** A API de sincronização local de pedidos (Orders) foi atualizada para consumir do `/v1/orders`, mapeando schemas atualizados.

### 4. Correções e Estabilidade (v4.0.11)
- **Módulo de Metas (Goals):** A API passou as usar o Firebase Admin de forma unificada e exclusiva na camada do servidor para gestão das metas, removendo a dependência local (SQLite) ou acessos via Firebase Client no frontend. 
- **Setores (Cache e Storage):** Corrigido o bug na base IndexedDB Dexie que forçava salvamentos locais silenciosos, causando conflitos em edições. Adicionado headers de `Cache-Control` restritos a todas as rotas servidas no NodeJS (SQLite) para inativar recarregamento de caches errôneos de requisições `GET` feitas localmente após edições em componentes.
- **Fim do Loop de Deletados:** Implementada lógica de "Sync de Deletados" no `SectorsRepository`. Ao buscar a lista da API (agora local), o sistema remove automaticamente do IndexedDB qualquer setor que não esteja presente no retorno da API, garantindo que a UI reflita apenas a realidade persistida.

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

### 3. Estrutura de Diretórios (Shape Oficial V4.7.0)
```text
/
├── apps/
│   ├── web/              # Frontend UI (React + Vite)
│   │   ├── src/
│   │   │   ├── app/      # Bootstrap e composição global
│   │   │   ├── components/ # Componentes UI e Layout
│   │   │   ├── features/ # Núcleo de negócio modular
│   │   │   ├── hooks/    # Hooks atômicos
│   │   │   ├── pages/    # Re-exports das rotas
│   │   │   ├── services/ # Infra de baixo nível e Stores
│   │   │   └── types/    # Tipos do frontend
│   │   ├── public/       # Assets públicos
│   │   └── vite.config.ts, tailwind.config.js, etc.
│   │
│   └── api/              # Backend Services (Express + SQLite/Omie)
│       ├── src/
│       │   ├── bootstrap/ # Setup do Express, Plugins, Vite middleware
│       │   ├── config/    # Variáveis de ambiente
│       │   ├── modules/   # Módulos autonômos (Auth, Dashboard, Products, etc.)
│       │   ├── shared/    # Códigos compartilhados, AppError, etc.
│       │   └── legacy/    # Códigos antigos mantidos por compatibilidade
│       └── server.ts      # Entry point
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
