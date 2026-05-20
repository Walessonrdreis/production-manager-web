# Bug: Cache Local Desatualizado Sobrepondo Dados da API

## Problema
Os dados presentes na aplicação muitas vezes não refletiam os dados reais e atuais da API (produção) após ações de CRUD, e muitas buscas preferiam consultar o cache local por conta dos tempos configurados, levando o usuário a observar informações obsoletas.

## Causa Raiz
1. Configurações agressivas de `staleTime` no React Query (como 30 minutos e 10 minutos), impedindo refetch automático em curto prazo de tempo.
2. Mutações de estado não invalidavam o cache obrigatoriamente (chamavam `invalidateQueries` apenas no `onSuccess` e não no `onSettled`).
3. Algumas lógicas de repositório falhavam na premissa "Network-First", necessitando tratamento para consumir da rede primeiro e salvar no IndexedDB de modo silencioso para fins de tolerância a falha.

## Passos Realizados (PRONTA)
- [PRONTA] Alteração do `staleTime` para `0` ou valores mínimos em hooks como `useSectors`, `useGoals`, `useOmieProducts`, mantendo apenas o `gcTime` elevado.
- [PRONTA] Migração de `queryClient.invalidateQueries()` do bloco `onSuccess` para o `onSettled` nas mutações de:
  - `useToggleProduced` e mutações relacionadas em `useLocalProduced` 
  - `useSyncStage20`
  - `useSyncCatalog`
  - `useCollaborators`
  - `useProductionSchedules`
  - `useProductionOrders`
- [PRONTA] Padronização do `useGoals` mudando as regras de invalidação para o bloco `finally` nas funções manuais.
- [PRONTA] Implementação do conceito "Network-first" com fallback (tenta API, falhando usa Cache), salvando resultados localmente de forma silenciosa para:
  - `GetSectors.ts`
  - `GetOmieProducts.ts`
  - `GoalsRepository.ts`
  - `PlanningRepository.ts`

## Status
Aprovado e implementado integralmente.
