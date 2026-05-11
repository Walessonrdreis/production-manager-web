# Implementação: Separação de Nomenclatura entre Produtos (Catálogo Omie) e Estoque Local

## Como foi feito
- Identificamos o problema na mistura da nomenclatura `products` como um conflito semântico e arquitetural no backend e no frontend, onde `products` representava simultaneamente O Catálogo original e o Estoque salvo localmente.
- Criamos a estrutura no servidor na API contendo `modules/catalog` e `modules/stocks`.
- Alteramos a instância Express para direcionar requests das rotas `/api/catalog` e `/api/stocks` de modo correspondente.
- Atualizamos e re-roteamos o painel `apps/web/src/features/products` trocando para a semântica correta `/stocks`, refazendo os hooks `useStocks` (substituindo `/hooks/products/useMyProducts`) com retrocompatibilidade nos imports espalhados (`CatalogPage`, `SectorsPage`, `PlanningPage`, etc).
- Limpamos de modo seguro a parte inutilizada do cache em `apps/api/src/modules/products` que gerava ruído.
- Atualização feita no `PROJECT_SUMMARY.md`.

## Melhorias
- Código mais rastreável e aderindo perfeitamente ao Princípio da Responsabilidade Única (Global SRP).
- Reduz a confusão ao conectar integrações futuras de PDV que envolvem Produtos x Estoques separados, promovendo Crescimento Orgânico maduro na plataforma.
- A exclusão do arquivo antigo otimizou o linting e tipagem da navegação pela suíte do Vite.
