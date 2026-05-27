# Correção de Bug: productionOrders.filter is not a function

**Data:** 2026-05-27
**Componente:** ProductionOrdersTab

## Descrição do Bug
Um travamento ocorria no componente `<ProductionOrdersTab>` com a mensagem de erro: `productionOrders.filter is not a function`.
A aplicação exibia o ErrorBoundary porque a renderização quebrava.

## Causa Raiz
O erro acontecia porque a variável `productionOrders`, vinda do hook `useProductionOrders`, não estava sendo recebida como um array em determinados cenários (por falha de rede, dados de API irregulares, ou endpoint retornando um objeto invés de lista). O componente tentava chamar a propriedade `.filter()` diretamente, assumindo que `productionOrders` era sempre um array válido.

## Como foi corrigido
- Foi adicionada uma camada de validação no hook `useProductionOrders`, retornando uma lista vazia `[]` caso `response?.data` não seja um Array (`Array.isArray()`).
- Adicionado salvaguarda defensiva dentro do arquivo de visualização `ProductionOrdersTab.tsx`, garantindo que o `.filter()` rode apenas quando for verificado que a variável é uma matriz.

## Como evitar no futuro
Sempre que consumirmos arrays de APIs ou hooks customizados assíncronos, precisamos garantir por meio do método defensivo de `Array.isArray()` ou default fallback estruturado que os métodos interativos de Array(`.map()`, `.filter()`, `.reduce()`) só sejam chamados em arrays. Assim garantimos estabilidade na UI se a API variar a payload de resposta.
