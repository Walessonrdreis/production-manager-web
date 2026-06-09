# Planejamento de Atalhos de Teclado (UX) - Product BOM Editor

**Status**: Planejado para o futuro (Pós-MVP)
**Contexto**: Melhoria de Usabilidade e Navegação Rápida
**Data**: 2026-06-05

## Visão Geral
Durante o desenvolvimento do MVP, focamos no botão `[x]` e no fechamento via `Click Outside` para o popover de busca de insumos para fechar o ciclo de usabilidade essencial do Editor de Receitas/Estruturas (ProductBomEditor). 

Foi discutida e validada a necessidade de implementação de atalhos de teclado (Teclas de Atalho) nativos para melhorar o fluxo de usuários "Power Users" que preferem a navegação via teclado, contudo, por segurança e prioridade (foco na API 1 e CRUD base do Omie), esta implementação foi adiada.

## Melhorias Mapeadas

### 1. Escback (Ação Voltar com `ESC`)
- **Comportamento**: A tecla `ESC` servirá como "Desfazer / Fechar Modal / Voltar". 
- **Escopo no Editor de Receitas**:
  - Pressionar ESC dentro de um input cancela a edição ou zera a busca do combobox.
  - Pressionar ESC com o modal/popover lateral de busca ou dropdown de produtos aberto deve fechá-lo.
  - Pressionar ESC na página limpa (sem modais abertos) deve navegar para a tela/página anterior iterativamente, até chegar à página inicial (Ex: Volta para Lista de Produtos).

### 2. Tab Navigation (Confirmação Dinâmica com `TAB`)
- **Comportamento**: A tecla `TAB` (ou |<- ->|) e `ENTER` como fluxo fluido de confirmação.
- **Escopo no Ponto de Busca de Insumo**: 
  - Ao pesquisar no mini-input do "Vincular a Produto", o sistema filtrará os itens.
  - Caso o sistema identifique ou o usuário utilize as setinhas do teclado (Cima/Baixo) para focar no produto desejado, o `TAB` ou `ENTER` confirmará o item na hora.
  - Ao confirmar, o sistema imediatamente fará o bind do ID do produto Omie e fará o "auto-focus" do cursor direto no input da lateral direita => "Quantidade" ou "Medida", pronto para digitação contínua sem necessidade de clique do mouse.

## Cuidados Levados em Consideração (Por que foi adiado?)
Como estamos gerenciando um formulário complexo com estados aninhados:
- **Event Bubbling / Conflitos de ESC**: É preciso gerenciar quem escuta o `ESC` primeiro para não acontecer da pessoa apertar para fechar um simples modal, e o sistema fazer voltar uma página inteira, perdendo o progresso das edições da receita que não foi salva.
- **Trap Focus / Acessibilidade**: O uso do TAB requer um "focus management" rigoroso, criando ref (useRef) dinamicamente para passar entre o Modal de Busca -> Campo de Qtd Numérico de uma forma previsível.

## Próximos Passos
1. Finalizar integrações core da API 1 (CRUDs do Omie).
2. Adicionar uma biblioteca leve (ex: react-hotkeys-hook) ou hook customizado (`useKeydown`) no front-end para gerenciar o escopo de modo isolado.
3. Testar de forma isolada na UI para evitar sobreposição nativa de atalhos do navegador.
