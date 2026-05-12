# Refatoração: MyProducts (Stocks) Sync com Firebase (Backend API)

**Data:** 11/05/2026
**Objetivo:** Eliminar o comportamento "offline first" (IndexDB local) do `MyProductsRepository` na listagem de favoritos/estoque, fazendo o frontend consumir diretamente os endpoints REST (`/stocks`) configurados no servidor Express.

## Como foi feito:
1. **Verificação da Rota Central:** Analisamos os controllers da API (`StocksController.ts`) e vimos que as rotas HTTP GET, PUT, POST e DELETE já estavam habilitadas e prontas para processar requisições em `/stocks`.
2. **Criação do Repositório Integrado:** Criamos um novo arquivo `ApiMyProductsRepository.ts` no lugar de `MyProductsRepository.ts`, onde mapeamos todas as operações CRUD (salvar, atualizar, deletar, consultar, e limpar tudo) para as rotas com `apiClient` e as chaves corretas de "ENDPOINTS.STOCKS.BASE".
3. **Substituição (Swapping) de Importações:** No frontend (especificamente em `index.ts` interno a "stocks", `useStocks.ts` e `useActivityLogs.ts`), modificamos as importações para apontar para `ApiMyProductsRepository`.
4. **Remoção de Legado:** Ao confirmarmos que tudo constroi sem erros, removemos o indexDB solto no arquivo `MyProductsRepository.ts` para evitar ambiguidade ou dependências inúteis (`dexie`).

## Reforço de Arquitetura:
Garantimos a manutenção do *Optimistic UI* no `useStocks` cancelando pre-fetches e corrigindo a cache apenas caso a chamada ao endpoint retorne sucesso, provendo um "fallback visual" imediato na tela, enquanto a Network confirma a transação nos bastidores. 
Isso permite que a aplicação Web opere unificada e os produtos salvos em Nuvem possam ser consumidos por múltiplos dispositivos daquele Tenant.

Todas as modificações foram testadas sem quebrar a aplicação original.
