# Resumo do Projeto: Production Manager
**Versão:** v4.17.14 (Atualizado em 19/05/2026 - Correção de Build e Banco Postgres)

## 🎯 Objetivo
Sistema de gerenciamento de produção industrial que integra dados da API Omie com funcionalidades locais de planejamento, rastreamento de progresso e gestão de metas. Aquitetura em transição para Relacional Nativo (PostgreSQL).

---

## 🏗️ Arquitetura Técnica (ADR-004 & Guia Operacional)
### 0.24. Sincronização Local-Postgres de Metas (v4.17.14)
- **Correção de Prisma Model para Metas:** As metas (Goals) criadas no Frontend não estavam sendo persistidas no PostgreSQL porque o `schema.prisma` backend contava com uma estrutura `Goal` desatualizada (sem colunas de tipo, SKU, setor ou colaborador). O Schema foi adequadamente sincronizado à interface `ProductionGoal` e aplicado `db push` de forma a garantir que toda entrada local reflita imediatamente ao DB central.

### 0.23. Correção de Diretório de Build Artifacts e Full-Stack Deploy (v4.17.13)
- **Correção no Output do Vite e Server Root:** A pipeline de deploy do AI Studio requer que os *build artifacts* da SPA sejam gerados no diretório mapeável `dist` da raiz do repositório para o contêiner gerenciar a inicialização corretamente. O `vite.config.ts` possuía a config `outDir: 'dist'` que estava gerando os arquivos de client dentro de `apps/web/dist` em vez de os convergir junto à premissa do `server.cjs` no diretório de release.
- **Integração Full-Stack AI Studio (app-entry vs server):** O script `start` foi restabelecido para `node server.ts` acoplando um stub que executa exatamente o pacote compilado e bundlado `dist/server.cjs` do backend. O endpoint estático hospedado pelo Server Node agora aponta consistentemente para `dist`, resolvendo os erros de 404 e tela em branco além de estabilizar a rotina "Build artifacts are empty", sincronizando a aplicação entre Dev, Homolog e Prod.

### 0.22. Correções de Infraestrutura API e Fallback de Rotas SPA (v4.17.12)
- **Correção SPA Router ("cannot get /"):** Em ambiente de desenvolvimento, requisições de frontend a rotas não mapeadas na API legavam erros devido a falha no repasse do fallback para SPA com middleware Vite. Configurada rota explícita `app.use('*')` no `server.ts` que delega requisições diretamente para renderizar e hidratar o index.html, garantindo suporte ao React Router DOM a cada recarregamento da página. Rota de prod pareada.
- **Melhorias de Infra:** Introduzidas de acordo com a Regra 16 de Observabilidade. Foi instalado `helmet` e `cors` no App `apps/api` e embutidos loggers explícitos com os níveis INFO, WARN e ERROR reagindo de acordo com a premissa de capturar tráfego real em `/api`.

### 0.21. Resolução Constante de Crashes e Erros de Mock no Ambiente Local (v4.17.11)
- **Correção de Crashes por Ausência de Banco (Erro 500):** O arquivo de configuração `prisma.ts` que instacia o PrismaClient injeta agora um `DeepProxy` estruturado perfeitamente. Antes, quando a variável global `DATABASE_URL` não estava presente, o client retornava uma função lançadora de erro para a propriedade do repositório (Ex: `prisma.producedRecord`), o que gerava um `TypeError` não tratável (ex. `findMany is not a function`) e estourava um Error 500 no console para toda a aplicação React. Com o Mock Dinâmico, métodos como `findMany`, `count`, e `findUnique` retornarão arrays vazios e inteiros nulos nos cenários offline-first como falhas graciosas em vez de matar a inicialização do app.
- **Correção Stock Refresh (Erro 415):** O disparo de refresh de estoque estava devolvendo o cabeçalho 415 Unsupported Media Type da API remota pois o Axios não injetava cabeçalho de ContentType para verbos `.post` sem parâmetros de payload. Adicionado escopo manual `{ headers: { 'Content-Type': 'application/json' } }` em `catalog.adapter.ts`.

### 0.20. Automação de Histórico de Produção via Integração (v4.17.10)
- **Migração para Histórico por Ingestão Externa:** Seguindo a nova regra de negócio, os produtos presentes no `production-control` que forem retirados (ausentes via sync) após atualização da API V1 serão considerados como produzidos. A funcionalidade foi implementada de maneira nativa no backend no arquivo `SyncOrdersUseCase`. Antes de deletar a Ordem obsoleta (excluída do estágio 20 externo), o processo busca seus respectivos produtos internos (`items`) e lança automaticamente no PostgreSQL (`ProducedHistory`) injetando ID, quantidade e datestamp correta. Uma regra idempotente avalia se aquele evento exato não foi finalizado à mão, impossibilitando clonagens históricas.

### 1.1. Refatoração do Controle de Produção Híbrido (Prisma) (v4.17.0)
- **Migração do Controle de Produção (Passo 1):** Criados os repositórios Prisma (`PrismaProductionRepository`) e atualizado localmente os USE CASES para fazer o merge com a API externa Render (preservando o double REST) substituindo a antiga lógica do banco local que não estava totalmente integrada ao Prisma na aba de Controle de Produção. Rotas de Save/Update/Delete de Produção agendada e concretizada foram expostas de volta à API interna ligadas nativamente ao PostgreSQL.
- **Migração do Controle de Produção (Passo 2):** Inclusão de novos UseCases para busca singular detalhada por ID, também permitindo busca híbrida externa caso o ID não pertença ao Prisma, assim as rotas `GET /production/produced/:id` e `GET /production/schedules/:id` atendem transparentemente a renderização frontend.

### 0.12. Correção na Formatação Transacional de Datas (v4.17.2)
- **Ajuste de Exibição de Data:** Foi corrigido um bug crítico onde datas provenientes do banco Prisma (ISO String) quebraram o cálculo visual do front-end (`Production MonitoringTable`), retornando strings mal formatadas como `19T00:00:00.000Z/05/2026`. Formatações UTC genéricas foram colocadas tanto no painel quanto no InputHTML da Modal.

### 0.19. Ajuste no Tratamento de 404 (Axios Interceptors) (v4.17.9)
- **Mitigação de Global Toasts:** Operações como verificação prévia (`getById`) ou deledade idempotente devolviam "Erros Críticos na Interface" porque o banco Prisma estrito passou a devolver 404 e o Axios em sua configuração reage aos 4XX rejeitando Promise. A camada HTTP repositória do local do Frontend (`ProducedRepository` e `ScheduleRepository`) agora utiliza a diretiva `validateStatus` do Axios, tratando status 404 como "Resolvidos/Sucesso Idempotente", para que a interface flua perfeitamente sem notificações assustadoras quando um registro não for encontrado propositalmente.

### 0.18. Correção de Mapeamento de ID na Exclusão (v4.17.8)
- **Ajuste de ID via Frontend:** Como mitigação ao controle estrito de 404 implementado no Prisma, foi resolvido o problema onde o Frontend tentava deletar agendamentos usando a `description` da produção mapeada frouxamente como o `id`. O `RemoveProductionSchedule` foi adaptado para traduzir a descrição e extrair o `uuidv4` autêntico usando a listagem em memória, despachando a chamada `DELETE` adequadamente para o ID no backend, o painel agora apaga efetivamente com status 200.

### 0.17. Remoção de Sucesso Falso na Deleção do Prisma (v4.17.7)
- **Correção de Retorno no PrismaProductionRepository:** Em observação estrita à nova regra adicionada ao AGENTS.md, os "sucessos falsos" previamente colocados no repositório foram removidos. Agora, quando os métodos `deleteProducedRecord` ou `deleteSchedule` solicitarem a exclusão de um ID inexistente no banco local (lançando `P2025` no Prisma), eles irão estourar explicitamente um erro 404 de "Record not found" por meio do `AppError`, ao invés de prosseguir silenciosamente.

### 0.16. Fixação do Gerenciamento Centralizado de Produção (v4.17.6)
- **Remoção de Requisições da API Externa para Controle de Produção:** Acatando a regra de negócio definida, a API legada em Render agora é usada estritamente para `Produtos` e `Pedidos`. O recurso de Listagem Híbrida e Deleção Dupla de Produção (Agendada e Concretizada) foram removidos de `ProductionUseCases`. Dados de produção são manipulados 100% de forma local usando o Prisma/PostgreSQL. Removedor o Adapter `production.adapter.ts`.

### 0.15. Correção de Remoção Híbrida de Produção no Backend (v4.17.5)
- **Delete Simulatêneo Rest-API Externa e Prisma:** Após a supressão do erro 500 do Prisma (em dados exógenos de listagem híbrida híbrida), o delete "silencioso" não executava a ação na API Externa. O item voltava a ser listado pela rota Get após a página atualizar. Foram implementadas as chamadas HTTP `DELETE` na API legada no `ProductionAdapter` resolvendo o problema nos UseCases e apagando de fato o dado online.

### 0.14. Correção de Erro (500) em Deleção Híbrida de Produção (v4.17.4)
- **Supressão do Erro P2025 do Prisma:** Refatorado o `PrismaProductionRepository` para ignorar pacificamente erros `P2025` ("Record to delete does not exist") nos métodos de `deleteProducedRecord` e `deleteSchedule`. Isso estabiliza a interface quando o usuário manda excluir dados exógenos (que vem somente da API externa mas não constam no PostgreSQL local).

### 0.13. Correção de Fetch de APIs de Produção (v4.17.3)
- **Correção no Endpoints do Adapter Backend:** A listagem e reversões de Controles de Produção estavam falhando perante um `404` originado na comunicação do Prisma Proxy (`ProductionAdapter`) com a API Externa Renderizada devido à uma URL incorreta (`/admin/produced`). Redirecionado para a correta `/dashboard/produced` e implantado graceful fallback de arrays vazios `[]` para listagens incompletas do legado.

### 0.11. Correção de Encoding em URLs na Produção (v4.17.1)
- **Correção no Encode de Parâmetros ID:** Resolvido o problema em que IDs textuais de Produção que continham espaços ou símbolos como `%` geravam erros `400 Bad Request` do servidor Nginx. Adicionada a função `encodeURIComponent(id)` nos repositórios front-end para envio seguro de deleções e reversões.

### 0.10. Correção de Consumo de Sectores e Operações (v4.16.5)
- **Correção da Listagem de Setores:** A tela de "/sectors" parou de puxar dados da API externa OnRender devido ao retorno duplo envelopado (Double Wrapper JSON). O `SectorsAdapter` do backend foi ajustado para efetivamente planificar as listas devolvendo apenas o Array bruto.
- **Implementação do CRUD Baseado em Adapter Externo:** Foram implementados os casos de uso de Criação, Deleção e Atualização na API Intermediária conectando as rotas tradicionais aos verbos requeridos na API online Onrender visando manter perfeitamente operante as integrações.

### 0.9. Otimização de Boot de Container (v4.16.4)
- **Correção de Gargalo de CPU:** Foi inserido um limitador de tempo (`setTimeout` de 15s) no arquivo `jobs.ts` para as requisições iniciais síncronas (`runAllSyncs`) de `Orders` e `Catalog` na API externa (Render). Isso resolveu um efeito dominó severo em que a aplicação travava o Render React no momento em que a Sandbox acordava, criando o looping visual irritante "Build -> Render Start".

### 0.8. Adicionado Modo Noturno (v4.16.3)
- **Implementação do Tema Noturno:** Adicionada a customização de tema `Dark Mode` suportada pela versão do TailwindCSS v4. Criado `ThemeContext.tsx` mantendo persistência no localStorage. O toggle foi incluído nativamente no `Topbar.tsx`, trocando dinamicamente as classes da estrutura base (`AppLayout`, `PageContainer`, `Card`) e garantindo adaptabilidade visual, sendo agora o padrão para novas telas do app.

### 0.7. Correção no TrackingLogic do Dashboard (v4.16.2)
- **Correção no Double Wrapper API:** O arquivo `TrackingLogic.aggregateStage20Totals` no Frontend foi aprimorado para decodificar e processar sem falhas arrays encapsulados mais profundamente (ex: `rawData.data.data`). Isso garante que as rotas de totais devolvidas através dos `UseCases` com `HttpResponseBuilder` da API continuem hidratando perfeitamente a lista visível da página `Controle de Produção` sem a necessidade de interferir ou retroceder a robustez dos Responses Globais do Microserviço.
### 0.6. Integração Trello (MVP Webhook v4.15.0)
- **Integração Backend-Driven (Trello Webhook):** Desenvolvido o MVP da integração do Trello com a aplicação, com processamento via webhook da nossa API do Firebase e criação automática de Ordem de Produção (OP).
- **Idempotência e Cautela (SRP e ADR-007):** Criado fluxo paralelo na API que converte a requisição do Trello mapeando a string título do card para os dados requeridos e injeta chamando com re-uso total do `CreateProductionOrderUseCase` sem modificar o fluxo de OP Manual já existente.
- **Testes Positivos:** O MVP (Versão 2 será apenas o merge completo pós aprovação e validação deste MVP) foi construído e verificado localmente usando os endpoints e fluxos do Cloud Firebase atual e já reflete em ambiente real sem comprometer estabilidade.

### 0.4. Transição Firebase para Prisma (v4.16.1 - Concluído no Frontend)
- **Remoção do Offline Sync:** Todos os repositórios baseados em cache local e sincronização offline com o **Firebase Firestore** na camada do frontend (`apps/web`) foram completamente deletados. A aplicação Web agora atua 100% de forma direta via `apiClient`.
- **Implementação Backend Integral:** Com o Prisma e PostgreSQL configurados na API, o fluxo deixou de utilizar a abordagem híbrida (salva redundante e sync offline na UI), assumindo puramente o back-end single source of truth para as coleções `sectors, planning, production, dashboard, goals, customers e collaborators`. Firebase Auth mantido ativo.
- **Implementação (Etapas 1-4):** Integrado o Prisma ORM (`@prisma/client`) à API, configurando um banco local estruturado (em transição para PostgreSQL). Todos os repositórios Firebase Admin (`ProductionOrders`, `Goals`, `Collaborators`, `Stocks`) foram substituídos por implementações `Prisma*` (via Dependency Inversion - DIP), acompanhados por um refinamento rigoroso no `schema.prisma`.
- **Sincronização Bidirecional Refatorada:** Os UseCases pesados de sincronização (Ordens, Clientes, Catálogo) também foram comutados de `Firebase` para os novos repositórios Prisma, sem impactar as interfaces Typescript existentes. A Etapa 5 (Migração final dos dados restantes) será executada em sequência.

### 0.5. Layout e Experiência do Usuário (v4.14.0)
- **Menu Lateral Recolhível (Collapsible Sidebar):** Refatoramos o `Sidebar` para recolher em telas de computadores, exibindo fundamentalmente os ícones e expandindo suavemente no hover (`group-hover`), preservando o comportamento natural da página sem ocupar espaço horizontal desnecessário. Aplicou-se nova estilização (`shadow-xl`, `whitespace-nowrap`, `opacity-100/0`), reestruturação de textos em div fluida com `overflow-hidden` fixado a 64 unidades que reage de modo coeso quando a barra retrai para `84px`, prevenindo qualquer layout shift ou falha em flexboxes.

### 0.4. Evolução do Controle de Produção (v4.13.0)
- **Rastreamento de Produção Específico por Pedido:** Corrigida severa inconsistência onde "Alternar Tudo" na tela de controle vinculava produtos marcados de forma genérica (bulk). Agora a atribuição e contabilização da quantidade produzida obriga explicitamente o ID do pedido original (Omie), impedindo que marcações passadas recaiam falsamente sobre novos pedidos importados.
- **Histórico de Produção em Abas:** Introduzido um sub-pilar em `/production-control` ("Monitoramento" vs "Histórico"); a nova aba expõe todos os registros cronológicos confirmados de encerramento da Etapa 20 agrupados de forma polida e com referência ao Pedido, resolvendo as dores do rastreio e auditoria produtiva.

### 0.11. Separação de Nomenclatura entre Produtos (Catálogo Omie) e Estoque Local (v4.12.0)
- **Desacoplamento de Domínio:** O módulo antigo `products` causava ambiguidade de nomenclatura entre produtos brutos vindos da Omie e saldos manipulados no estoque local.
- **Divisão Backend e Frontend:** O módulo foi decomposto com sucesso em dois módulos independentes: `catalog` e `stocks`. Ambos implementados de ponta a ponta na API (`modules/catalog` e `modules/stocks`) contendo o Repository Pattern autônomo, rotas isoladas (`/api/catalog` e `/api/stocks`) e respectivo pareamento no Frontend (`features/catalog` e `features/stocks`).
- **Limpeza do Sistema:** A versão legada e ambígua `products` foi completamente removida da API e da Web, firmando os princípios de granularidade.

### 0.10. Gestão de Estoques e Categorização de Produtos (v4.11.0 - Atual)
- **Painel de Estoques Embutido:** A rota `/my-products` (agora rotulada como "Estoques" na UI e Sidebar) evoluiu para suportar abas de múltiplos estoques departamentais (Barras, Confeitaria, Chocolate Refinado, Insumos, Limpeza, Maquinários).
- **Tipagem Dinâmica e Retrocompatibilidade:** A identificação do estoque foi abstraída na propriedade union type `stockType` anexada à entidade `SavedProduct` (`db/models.ts` e `types/api.ts`). Produtos salvos previamente assumem a categoria legada/padrão "Barras".
- **Fluxo de Alimentação Modular (Catálogo):** Implementada a seleção contextual do destino. Ao salvar um ou múltiplos itens no Catálogo Omie, um novo modal `SaveToStockModal` exige a atribuição obrigatória a qual categoria de estoque aquele produto fará parte, direcionando a separação das "classes" de produtos, separando o negócio para a interface com segurança.
- **Visualização em Abas:** Na tela de Estoques a visualização agora usa Tab bar contendo os filtros dinâmicos de renderização. A ação "Limpar Todos" agora é granular e contextual ("Limpar Categoria Atual").

### 0.9. Gestão de Ordens de Produção (v4.10.0)
- **Painel Central de Ordens:** A rota `/orders` foi expandida. Agora a página `OrdersPage` funciona como um painel central separado por abas: `Pedidos de Venda` (importados do Omie) e as novas `Ordens de Produção` (locais).
- **Módulo Backend Independente (API):** Concluindo o requisito arquitetural de divisão, foi criado o repositório back-end `production-orders` contendo toda a pipeline (`Controllers`, `Routes`, `UseCases`, `DTOs` e `FirebaseAdminProductionOrderRepository`). 
- **Refatoração do Front-end para a API:** O frontend não faz mais comunicação direta do cliente Web com o Google Firestore via `FirebaseProductionOrderRepository`. Tudo foi substituído pelo consumo tradicional no padrão de `Repository Pattern` usando `apiClient` e as rotas `/api/production-orders` - deixando a aplicação 100% pronta e modular para infraestrutura.
- **Relacionamento Local:** As OPs criadas continuam consultado o banco IndexedDB local de Produtos (Catálogo) e Setores, permitindo um select dinâmico sem sobrecarregar a API principal.

### 0.8. Evolução de Metas Multi-entidade (v4.9.0 - Atual)
- **Sub-divisão em Abas (Single Page):** A configuração de metas (`GoalsManagementPage.tsx`) evoluiu para não ficar restrita apenas aos produtos. Mantendo a essência SPA, a página agora conta com abas superiores principais: "Por Produto", "Por Colaborador" e "Por Setor".
- **Gestão Isolada em Componentes:** Para respeitar o Princípio de Responsabilidade Única (Global SRP), a interface original foi desacoplada em três novos componentes (tabs): `ProductGoalsTab`, `CollaboratorGoalsTab` e `SectorGoalsTab`.
- **Evolução do Schema e Banco:** O schema de persistência IndexedDB de metas (`GoalsDB`) foi atualizado (v2) adicionando novos índices (`type` e `collaboratorId`). Adicionalmente o domínio `ProductionGoal` passou a aceitar dinamicamente os targets através da prop union `type: 'product' | 'collaborator' | 'sector'`, com retrocompatibilidade garantida.
- **Integração Plena (React Query):** As abas novas consomen os hooks maduros `useCollaborators()` e `useSectors()` mantendo o cache aquecido sem poluir a renderização, proporcionando uma experiência instantânea ao construir metas para o time ou maquinário.

### 0.7. Renovação do Dashboard Estratégico (v4.8.6)
- **Padrão de UI para Listagens (Tables):** Consolidado como padrão o visual limpo implementado nas listas de Metas (`GoalsManagementPage.tsx`). Consiste em usar padding folgado nas células, empilhamento de informações relacionadas na mesma coluna (como código e descrição em fontes de pesos diferentes) e revelação opcional de botões de ações ao passar o mouse (`group-hover`), reduzindo a poluição visual generalizada.
- **Ações em Massa para Setores, Metas e Produção:** Ampliadas as funcionalidades do painel flutuante de seleção múltipla em "Meus Produtos". Inclusão de três novos botões de ação em massa:
  - **Setores**: Substitui ou define os setores produtivos em lote para os itens selecionados.
  - **Metas**: Abre um modal para definir Metas Diárias, Semanais ou Mensais agregadas para múltiplos produtos, salvando-os de forma encadeada no módulo de Metas do Firebase.
  - **Planejar**: Adiciona com um único clique os produtos correspondentes ao "Plano de Produção (Rascunho)" compensando seus Dèficits pendentes.
- **Ações em Massa para Categoria:** Ampliadas as funcionalidades do painel flutuante de seleção múltipla em "Meus Produtos". Inclusão do botão "Definir Categoria", que abre um novo Modal para aplicar categorizações (Vegano, Ao Leite, Ambos, Nenhuma) numa tacada só a vários itens selecionados da grade produtiva. O state respectivo (`updateBulkCategory`) foi atracado no `useMyProducts`.
- **Categorização de Produtos em Foco:** Implementada no `ProductDetailsModal` a funcionalidade de "Classificação por Categoria", permitindo ao gestor atribuir individualmente tags especiais como "Vegano" ou "Ao leite" aos produtos selecionados em "Meus Produtos". Adicionado este indicativo visual na listagem (na `MyProductsTable`) utilizando badges na cor esmeralda para os destaques.
- **Categorização e Metas por Colaborador:** Atualizado o modal e fluxo de criação/edição de Colaboradores (`CollaboratorsPage`), inserindo as propriedades obrigatórias para "Categoria de Produto" que aquele membro atende melhor e sua "Meta Diária".
- **Visualização Dinâmica de Team Details:** Implantado um clique sensitivo (`cursor-pointer`) na grid da listagem de Time (`CollaboratorPage`). Ao efetuar o clique livre na linha do colaborador, é exibido o novo modal detalhado "Detalhes do Colaborador", compilando informações ricas de Metas Diárias, Categoria Vinculada, Status e Setor através de widgets coloridos para rápida inferência visual. O comportamento foi cuidadosamente separado dos botões de exclusão e edição através de `stopPropagation()`.
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
