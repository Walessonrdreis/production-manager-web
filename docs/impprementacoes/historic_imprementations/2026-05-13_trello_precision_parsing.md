# Implementação: Parsing de Precisão e Lote Numérico (v4.15.2)
**Data:** 13/05/2026

## Descrição
Refinamento da extração de dados do Trello e padronização do campo de Lote como numérico. A lógica foi ajustada para remover valores padrão ('1') que causavam confusão e garantir que o Lote venha exclusivamente da entrada do usuário ou da descrição do card.

## Melhorias Realizadas
1. **Lote Numérico:** Campo `lote` no modal de OP alterado para `type="number"`.
2. **Resolução de Catálogo:** O use case agora busca no repositório de produtos real para preencher a descrição da OP automaticamente se um código for detectado no Trello.
3. **Limpeza de Fallbacks:** Removido o default `'1'` no parser. Se não houver lote, ele fica vazio, forçando a revisão.
4. **Acessibilidade:** Adicionados IDs e associações de labels em todo o formulário de OP.

## Como evitar regressões
- Verifique se o `ProductsAdapter` consegue atingir a API Omie no Render.
- Teste o parser com títulos de card sem hífens para garantir que o fallback de descrição (Lote: XXX) funcione.
