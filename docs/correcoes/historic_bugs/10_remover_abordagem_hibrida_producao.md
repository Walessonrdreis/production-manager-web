# Correção/Refatoração: Remoção de Consumo Híbrido da API Externa de Produção

## Descrição do Ajuste
A pedido explícito, as rotas relativas ao "Controle de Produção" (schedules e produced) que se comunicavam de modo duplo (Híbrido) com a APi Externa da Render (`production-manager-api.onrender.com`) foram limitadas.

Segundo a nova regra: "a api externa só serve para pegarmos os dados dos produtos dos pedidos". A parte de Controle de Produção deve ser operada apenas pela API interna.

## O Que Foi Feito
- **Remoção de Adapter**: Deletado o `ProductionAdapter` (`apps/api/src/modules/production/infrastructure/integrations/production.adapter.ts`).
- **Remoção de UseCases Híbridos**: Removidas todas as mesclagens (Merge com `fetchSchedules` e `fetchProduced`) e apagamentos (`deleteSchedules`, `deleteProduced`) com a API Externa em `ProductionUseCases.ts`. A API Interna agora consulta e deleta EXCLUSIVAMENTE do Prisma PostgreSQL.
- Limpeza também da rota legada `/dashboard/produced` do Express para evitar endpoints obsoletos apontando para fora indevidamente.
