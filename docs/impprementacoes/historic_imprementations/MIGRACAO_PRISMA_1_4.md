# Migração de Storage: Firebase para Prisma ORM (Etapas 1 a 4)

## Escopo
A fim de contornar os limites de cota gratuita do Firebase (`RESOURCE_EXHAUSTED: Quota exceeded`), iniciou-se a transição da camada de persistência para o Prisma, suportando inicialmente SQLite e em futuro próximo PostgreSQL via Render.

## Como foi feito
1. **Setup**: Instalamos as bibliotecas `@prisma/client` e `prisma` em `apps/api`.
2. **Modelagem**: Os modelos lógicos do domínio (`ProductionOrder`, `Goal`, `Collaborator`, `Order`, `Catalog`, `Customer`, `Stock`) foram reproduzidos no arquivo `schema.prisma`. As coleções complexas (sem schema estrito originadas de integrações) foram estruturadas preservando o conteúdo integral em campos Json (`String`).
3. **Repositórios (Contract-First)**: Criamos repositórios que implementam as exatas mesmas interfaces (`I...Repository`), como `PrismaProductionOrderRepository`, `PrismaAdminGoalsRepository`, `PrismaAdminCollaboratorsRepository`, e `PrismaStocksRepository`.
4. **Shadowing**: Ajustamos gradativamente as instâncias dentro dos *UseCases* (`UpdateProductionOrderUseCase`, `SyncOrdersUseCase`, e outros) para injetarem e utilizarem as novas classes do Prisma ao invés direto do `getAdminDb()`. Isso foi estendido em toda a cadeia de uso de dados Firebase Admin na API.

## Melhorias Garantidas
- Indepedência total do provedor de storage do Firebase.
- Tipagem rigorosa com Prisma ao lado do Typescript e validação DTO.
- Consultas protegidas contra vazamento de referências e limite de quotas.

*Aguardando prosseguimento da "Etapa 5: Script de Migração de Dados" conforme diretriz de passagens manuais.*
