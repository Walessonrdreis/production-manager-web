# Objetivo do Problema: Limit de Cota Excedida Firebase e Planejamento Prisma

## Descrição do Problema
O sistema parou de sincronizar dados e reportou o erro `[SYNC ORDERS] Error saving to Firebase: 8 RESOURCE_EXHAUSTED: Quota exceeded.`. Isso ocorre porque as requisições diárias de leitura/escrita no Firestore ultrapassaram o limite gratuito. A dependência do Firebase tornou-se um gargalo operacional. 

Como solução a ser discutida e validada, planejamos a migração estruturada do storage para um banco de dados relacional usando o **Prisma ORM** (conectado a um PostgreSQL no Render, onde já há infraestrutura conhecida).

## Plano de Ação Passo a Passo (Base para Implementação)

- [x] **Etapa 1: Setup e Configuração do Prisma**
  - Instalação e inicialização do Prisma (`prisma init`).
  - Criação do banco PostgreSQL/SQLite e definição de Variaveis de Ambiente (`DATABASE_URL`).
  - *Status: Concluído*

- [x] **Etapa 2: Modelagem Inicial (Schema)**
  - Mapeamento das coleções do Firebase (Products, Orders, Goals) para modelos relacionais no `schema.prisma`.
  - Execução de `prisma migrate dev`.
  - *Status: Concluído*

- [x] **Etapa 3: Implementação dos Repositórios (Contract-First)**
  - Criar as implementações baseadas no Prisma (ex: `PrismaProductionOrderRepository`) respeitando as interfaces já existentes da camada de Domínio, seguindo o pilar de Inversão de Dependência (DIP).
  - *Status: Concluído (Criados repos para ProductionOrders, Goals, Collaborators, Stocks)*

- [x] **Etapa 4: Shadowing e Injeção Suave**
  - Trocar gradativamente os repositórios usados nos *Use Cases* (Ex: substituição do `FirebaseRepository` pelo `PrismaRepository`) **sem** alterar as lógicas e os retornos do negócio.
  - *Status: Concluído*

- [ ] **Etapa 5: Script de Migração de Dados**
  - Desenvolver script iterativo para extrair dados remanescentes do Firebase e ingeri-los no PostgreSQL.
  - *Status: Aguardando*

- [ ] **Etapa 6: Virada de Chave, Limpeza e Ajuste da Base Histórica**
  - Testar todas as requisições. 
  - Registrar toda a migração em `docs/impprementacoes/historic_imprementations`.
  - Marcar a resolução do bug em conformidade.
  - *Status: Aguardando*
