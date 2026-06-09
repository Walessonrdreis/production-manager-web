# Planejamento: Módulo de Estoques (Chão de Fábrica Físico)

**Status**: Em Planejamento Inicial
**Contexto**: Organização do Catálogo em Estoques Físicos (API 1 / UI)
**Data**: 2026-06-08

## 1. Visão Geral
O objetivo deste módulo é replicar a organização do "chão de fábrica real" dentro do sistema. Em vez de uma listagem única e infinita de produtos (como no Catálogo geral), vamos fatiar a visualização dos dados em "Salas de Estoques", trazendo uma visão rápida, precisa e quase em tempo real do que a fábrica tem em mãos.

## 2. Princípio da Fonte Única de Verdade (Single Source of Truth)
Para evitar dados duplicados ou dessincronização:
- **Não haverá um "banco de dados paralelo" de estoques.**
- Os dados continuarão vindo do **Catálogo de Produtos (API 1 / Omie)**.
- O sistema apenas organizará a *visualização* e as *ações* filtrando o catálogo existente por **Categorias / Famílias** configuradas no Omie.

## 3. Os "Estoques" (Físicos / Virtuais)
A divisão inicial proposta reflete as áreas da fábrica:

1. **Estoque de Matéria Prima** (Açúcar, Leite em pó, etc.)
2. **Estoque de Embalagens** (Caixas, Rótulos, Plásticos)
3. **Estoque de Produtos Finalizados** (Barras prontas, Trufas, etc.)
4. **Estoque de Amêndoa de Cacau** (Insumo base / Especial)
5. **Estoque de Inclusões** (Castanhas, Frutas secas, etc.)
6. **Estoque DML** (Materiais de Limpeza, EPIs, Descartáveis)

## 4. Dinâmica de Agrupamento (Mapeamento 1:N)
Para garantir flexibilidade, a relação entre um "Estoque Virtual" no App e as Categorias do Omie não será de 1 para 1. Será **1 para N (Múltiplas)**.
- Exemplo: O "Estoque de Produtos Finalizados" pode agrupar simultaneamente as categorias "Barras Naturais", "Trufas", "Kits de Presente" e "Edições Comemorativas".
- O sistema fará um filtro múltiplo (Array de Categorias) sob o capô, garantindo que o usuário veja tudo em um só lugar.
- **Mudança de Categoria**: Se o time fiscal/administrativo alterar a Categoria de um insumo no Omie, o sistema (via webhook/sync diário) atualiza o banco. Automaticamente, na interface, o item *desaparece* da sala antiga e *aparece* na nova. Nenhuma ação manual de "transferir de sala" é necessária no app.

## 5. Saídas e Baixas Manuais (Ex: DML)
Alguns estoques não possuem baixa automática por Ordem de Produção (como caixas de papelão secundárias, produtos de limpeza do DML, EPIs). 
- O fluxo de requisição será simplificado: Um colaborador entra no "Estoque DML", encontra o produto, digita a quantidade e aperta `[Registrar Retirada]`.
- Isso enviará um comando para a API 1 realizar uma "Requisição de Material" ou "Ajuste de Estoque" abatendo o saldo no Omie, refletindo globalmente em tempo real.

## 6. UX e Interface Visual (UI)
- **Hub de Estoques**: Ao acessar a página inicial do módulo de estoques, o usuário verá blocos/cards móveis (mesma estrutura UX/UI que vem sendo consolidada). Cada card representará uma "Mesa" ou "Sala" (Ex: Bloco "DML", Bloco "Embalagens").
- **Subpáginas**: Ao clicar no card, o usuário entra na subpágina específica, cujo layout base é idêntico ao modelo consolidado do `CatalogV2List`, apenas travado no filtro da categoria respectiva.
- **Fronteira (DevBadge)**: Todos esses dados herdarão o selo **API 1 (Azul)**, pois as quantidades e descrições pertencem integralmente ao Omie, mudando para Roxo/Misto apenas se envolverem alguma meta interna superposta.

## 7. Administração Dinâmica das Salas (Configuração UI)
Para garantir que o sistema escale sem a necessidade constante de novas atualizações de código:
- **Painel de Gerenciamento de Estoques**: Criaremos uma página de configurações no futuro onde um usuário autorizado (Super Admin) poderá criar, editar ou excluir "Salas de Estoque virtuais".
- **Mapeamento Visual**: Nesta tela, será possível criar um novo card (ex: "Estoque de Uniformes") e selecionar, a partir das categorias que já existem no Omie, quais delas vão compor essa nova sala.
- **Armazenamento de Configuração (API 2)**: Essas definições (quais cards existem e as categorias mapeadas neles) farão parte do banco de dados interno da aplicação (API 2). Assim, a interface de "Estoque" lerá essa configuração do banco e renderizará os blocos dinamicamente.

## 8. Próximos Passos Sugeridos
- [x] 1. Estrutura de Dados e Gateways (Configuração das Salas)
- [x] 2. Hub Visual de Estoques (UI Principal)
- [x] 3. Subpágina da Sala de Estoque (Reuso do Catálogo)
- [ ] 4. Painel de Gerenciamento de Salas (Setup UI)
- [ ] 5. Fluxo de "Baixa Manual" (Estoque DML / Avulsos)
