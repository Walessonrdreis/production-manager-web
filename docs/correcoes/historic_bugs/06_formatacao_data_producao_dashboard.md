# Correção de Bug: Formatação de Data da Produção (Dashboard)

## Descrição do Bug
Quando um agendamento de Produção era criado via banco local Prisma e retornado como um ISO string (`2026-05-19T00:00:00.000Z`), a tabela `MonitoringTable` exibia a data quebra `19T00:00:00.000Z/05/2026` usando spliting incorreto que esperava o padrão formato de dia `DD-MM-YYYY` ou `YYYY-MM-DD`. Além disso, o usuário apontou a inconsistência ao editar a data na Modal de Edição.

## Causa Raiz
A função antiga `formatDate(dateStr)` e `getBadgeColor(date)` faziam de string splittings explícitos em `"-"` falhando ao lidar com instâncias ISO do `Prisma`. A `<input type="date">` no `ScheduleEditModal` também requeria nativamente string com format `YYYY-MM-DD`, quebrando sem manipulação.

## Como foi corrigido
- Refatorado `formatDate` para ser resiliente instanciando `new Date(dateStr)` e puxando em UTC (`dd/mm/aaaa`).
- O input de data no `ScheduleEditModal` foi adaptado para realizar parsing prévio que converte a ISO para string `YYYY-MM-DD` nativa do HTML5.
- Adicionado o hover/tooltip (Title) na badge indicando `HH:mm`.

## Passos Realizados
- [x] PRONTA: Correção de `formatDate` e `getBadgeColor` em `MonitoringTable.tsx` para usar o Objeto Date ao invés de `.split('-')`.
- [x] PRONTA: Limpando a visualização de fallback da badge de datas (Hover Tooltip - Título).
- [x] PRONTA: Extração segura do `YYYY-MM-DD` em `ScheduleEditModal.tsx`.

## Como evitar no futuro
Sempre garantir que as bibliotecas e utilitários da interface que lidam com datas estejam preparadas genéricamente para formatações vindas tanto em "Strings Planas" (`AAAA-MM-DD`) quanto objetos "ISO8601" (`AAAA-MM-DDTHH:mm:SSZ`).
