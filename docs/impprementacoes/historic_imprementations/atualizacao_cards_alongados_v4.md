# Atualização de Layout: Cards Alongados

**Data:** 11/05/2026

## Descrição
Melhoramos consideravelmente a apresentação das listas no sistema, abandonando os cards em formato "grid/bloco" e adotando o estilo de "cards alongados/linhas responsivas" (List View com estilo Card) nas seguintes áreas:
- Menu de Setores (`SectorsPage`)
- Aba de Metas por Produto (`ProductGoalsTab`)
- Aba de Metas por Setor (`SectorGoalsTab`)
- Aba de Metas por Colaborador (`CollaboratorGoalsTab`)
- Histórico e Em Andamento nas Ordens de Produção (`ProductionOrdersTab` e `OrdersTable`)
- Equipe / Colaboradores (`CollaboratorsPage`)

## Como foi feito
- **Remoção de Grid:** Substituída a exibição de grid-column automática (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3...`) por um conteiner único empilhado (`flex flex-col gap-3`).
- **Alinhamento em Linha:** O layout interno de cada Card foi reestruturado de flex em coluna ("card quadrado") para uma estrutura `sm:flex-row` que os assemelha a uma Data Table, agrupando os dados principais à esquerda (ex: Foto e Nome), dados secundários centralizados e ações com badges do lado direito.
- **Divisores Suaves:** Para aumentar a clareza dessas linhas em telas Desktop (ex: onde ficava muito vazio horizontalmente), adicionamos separadores verticais suaves (`border-l border-zinc-100`) para separar os detalhes rápidos de resumo dos botões de ação e status.
- **Ações Focadas:** As ações (editar/excluir, visualizar) continuam utilizando o comportamento de aparecer no hover da linha (`group-hover:opacity-100`), mas com os paddings e bordas levemente ajustados para a nova disposição de listagem.

## Benefícios
- Facilita o "Scan" de leitura visual humana de cima-a-baixo acompanhando as linhas. 
- Padroniza totalmente a User Interface junto das Listagens base da Aplicação, conforme as heurísticas apontadas na Regra de UI.
- Em mobile ele flexivelmente retorna ao encapsulamento original com itens empilhados.
