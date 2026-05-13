# Implementação: Refinamento da Integração Trello Webhook (v4.15.1)
**Data:** 12/05/2026

## Descrição
Melhoria na inteligência de dados extraídos do Trello para criação de Ordens de Produção (OP). O sistema agora é capaz de identificar produtos no catálogo oficial através do código ou nome presente no card do Trello, preenchendo automaticamente a descrição correta.

## Melhorias Realizadas
1. **Resolução de SKU:** Uso do `ProductsAdapter` no backend para buscar SKUs salvos e garantir que a OP tenha o nome/descrição correta do produto.
2. **Parsing Flexível:** Suporte a múltiplos formatos de nome (`Nome - Lote - Qtd`, `Nome - Código - Lote - Qtd`, `Código - Lote - Qtd`).
3. **Lote via Descrição:** Fallback para buscar o número do lote no campo "Lote:" da descrição do card, caso não esteja presente no título.
4. **UX no Frontend:** Campo de Lote alterado para `type="number"` para garantir entrada numérica e correção de labels para acessibilidade.

## Como evitar regressões
- Testar sempre o parser com strings de nomes variadas (`parseTrelloCardName.test.ts`).
- Manter o `ProductsAdapter` atualizado com a URL correta da API Omie/Render.
- Garantir que o `trelloCardId` continue sendo usado como chave única de idempotência.
