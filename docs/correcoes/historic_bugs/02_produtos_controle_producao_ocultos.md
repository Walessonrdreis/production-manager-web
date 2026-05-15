# Bug: Produtos não aparecendo no Controle de Produção

- **Data:** 14/05/2026
- **Funcionalidade:** Controle de Produção (`/production-control`)
- **Impacto:** O frontend não exibia a lista de itens concluídos no estágio 20, apesar do request no backend (logs) trazer os dados.

## Descrição do Bug
Após as refatorações recentes, a rota de consulta para dados do estágio 20 através da API (`GET /v1/admin/orders/stage20/totals`) passou a ter seu payload modificado (adicionando um encapsulamento pela implementação de sucesso local através de `GetStage20TotalsUseCase` e `HttpResponseBuilder.success`). O frontend recebia um array encapsulado resultando na estrutura JSON `{ success: true, data: { data: [...] } }`. Como o `TrackingLogic` estava preparado para `{ data: [...] }` ou puro array, ele falhava na correspondência devolvendo um array de produtos vazio.

## Causa Raiz
A camada `DashboardAdapter` retornava o corpo do JSON (`response.data`) do microserviço (`{ data: [...] }`). Em seguida o caso de uso `GetStage20TotalsUseCase` embalava esses dados novamente em uma key `data`. Por fim, o ResponseBuilder colocou num object `{ success: true, data: ... }`. Isso originou o layout com dois níveis de `data`. O `TrackingLogic` do frontend contava apenas com um nível (`rawData.data`).

## Como foi corrigido
O `TrackingLogic.aggregateStage20Totals` no arquivo `apps/web/src/features/production/domain/TrackingLogic.ts` foi atualizado para suportar de forma defensiva encapsulamentos profundos. Adicionado verificação para extrair valores em `rawData.data.data` caso seja um array válido, assegurando compatibilidade com as respostas do Proxy Local/Firebase API.

## Como evitar no futuro
- Ter mais testes end-to-end simulando a resposta completa do servidor Proxy (Mock Integration).
- Aplicar Tipagem Estrita e DTOs (Data Transfer Objects) tanto na entrada do proxy quanto na formatação de UseCases no frontend para evitar que encapsulamentos surpresas de rotas (`response.data` seguido de `.json({ data })`) passem desapercebidos.
