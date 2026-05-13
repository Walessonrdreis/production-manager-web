# Correção de Bug: Inversão de Lote e Código no Webhook Trello
**Data:** 12/05/2026

## Descrição do Problema
O sistema estava confundindo o Código do Produto com o Lote em certos formatos de título de card. Além disso, quando o card tinha apenas o nome e a quantidade, o lote era preenchido como "1" por padrão, o que não atendia à necessidade do usuário.

## Causa Raiz
O `parseTrelloCardName` assumia posições fixas sem verificar a existência de campos opcionais e possuía um valor default `'1'` no código-fonte para o campo `lot` quando o formato tinha apenas 2 partes.

## Ações de Correção
1. **Remoção de Default Hardcoded:** Removido o valor `'1'` do parser. Agora, se o lote não for identificado no nome, ele retorna vazio.
2. **Busca Contextual:** Implementada busca ativa do lote na descrição do card do Trello (regex `/Lote:\s*(\S+)/i`).
3. **Mapeamento Flexível:** Reorganizada a lógica de partes do nome para priorizar a extração da quantidade (última parte) e depois retroceder para o lote.
4. **Resolução por Catálogo:** O código ou nome extraído é agora testado contra a base de produtos da API Omie para resolver ambiguidades.

## Como evitar
- Nunca usar valores arbitrários (como "1") para campos que dependem de entrada do usuário ou integração externa.
- Documentar claramente os formatos suportados e validar contra casos de borda (edge cases).
