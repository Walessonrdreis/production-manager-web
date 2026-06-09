# Planejamento: Integração do Frontend com API 1 (Estrutura de Produtos)

**Classificação**: Refatoração Estrutural e Nova Integração
**Contexto**: A API 1 agora é a camada de integração primária (Anti-Corruption Layer) com o Omie. 
A API 2 representará o domínio. O Frontend consumirá os Read-Models e enviará comandos (CQRS) de forma assíncrona.

## Padrões Arquiteturais no Frontend (Regra 21 e 24)

1. **Gateways e Modo Fake/Real (Regra 21)**
   O frontend jamais chamará a API sem passar por um Gateway (Strategy) que permita a inversão entre Real e Fake via variável de ambiente.
2. **Observabilidade Visual (Regra 24)**
   As telas exibirão o `<DevBadge>` indicando ações e dados provenientes da `API 1` (Integração Omie) versus `API 2` (Domínio).

## Fases da Implementação no Frontend

### Fase 1: Padronização de Contratos e Gateways (Product Structure)
- **Criação do Contrato**: Interface `IProductStructureGateway` com abstrações claras para Leituras (Read-Models) e Comandos (Commands).
- **Read**: `getProductionReadiness(params)` -> chama `GET /v1/admin/read/products/production-readiness`.
- **Commands**: 
  - `applyStructure(productCode, payload, externalRequestId)`
  - `syncStructure(productCode, externalRequestId)`
  - `deleteStructure(productCode, externalRequestId)`
- **Implementações**:
  - `FakeProductStructureGateway`: Simulação em memória para usar localmente antes mesmo da API estar 100% ou para evitar sujar base ERP.
  - `RealProductStructureGateway`: Chamadas HTTP em `production-manager-api.onrender.com`.
- **Env Var**: Criação de `VITE_USE_FAKE_PRODUCT_STRUCTURE_API`.

### Fase 2: Adaptação UX para Assincronismo e Idempotência
- **Idempotência no Client**: Ao acionar salvar estrutura, o frontend gerará um `UUID` (como `externalRequestId`) e enviará na request.
- **Resposta 202 Accepted**: A UI deixará de usar `loading` bloqueante que trava até o Omie aprovar. Em vez disso, mostrará um feedback de "Comando Aceito - Processando em segundo plano", permitindo ao usuário continuar navegando ou fechar o modal.
- **Polling Analítico (Read-model Refresh)**: Podemos implementar um leve *refetch* no Read-Model (React Query) de tempo em tempo na view para refletir a atualização assim que o Job/Processamento finalizarem na API 1.

### Fase 3: Refatoração das Views de Catálogo (V2) e Create BOM
- Remover lógicas antigas que tentavam lidar com os dados crus do Omie e substituí-las pelos retornos mastigados do Read-Model (`canCreateProductionOrder`, `hasStructure`).
- O botão de criar ordem de produção obedecerá a flag binária do Read-Model.
- Adição dos DevBadges: `domain="api1"` na área de sync / estrutura e `domain="api2"` em dados operacionais (metas, filas).

## Preparação Exigida da API (em andamento pelo usuário)
Enquanto esta UI é preparada, o módulo de Produtos (Listagem) na API 1 está sendo equiparado para possuir comportamento idêntico (Read-Models performáticos + Comandos baseados em Filas/Jobs).
Quando ambos estiverem na mesma base, o Frontend consumirá `CatalogGateway` e `ProductStructureGateway` com as mesmas diretrizes simétricas.
