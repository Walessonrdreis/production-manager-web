# ADR 004: Transição para Monolito Modular (Monorepo)

**Status:** Aceito  
**Data:** 2026-05-07  
**Arquitetura:** Monorepo (apps/web + apps/api)

## Contexto e Objetivo
O projeto evoluiu de uma aplicação puramente frontend com persistência local para um sistema que exige uma backend dedicada para regras de negócio complexas, centralização de dados e futura escalabilidade multiuso. 

Este registro formaliza a transição da estrutura de diretórios para um modelo de **Monolito Modularizado**, utilizando o conceito de workspaces (Monorepo) para permitir que a aplicação Web e a API Backend coexistem e compartilhem contratos de dados.

## Definição de Estrutura (Monolito)

A estrutura oficial de referência é definida no arquivo `/Estrutura_Monolito.md`. Os principais pilares são:

### 1. Separação de Preocupações (Separation of Concerns)
-   **/apps/web**: Contém o frontend React já estruturado conforme a ADR 003. Esta camada é responsável pela interface e persistência Local-First (IndexedDB).
-   **/apps/api**: Contém o backend Express estruturado em módulos de domínio, focado em orquestração, integração com APIs externas (Omie) e persistência de longo prazo.
-   **/packages/contracts**: Pacote compartilhado contendo tipos TypeScript e esquemas Zod (Schemas) que definem a "fronteira" entre cliente e servidor.

### 2. Contratos Primeiro (Contract-First)
Toda comunicação entre `web` e `api` deve ser governada por contratos definidos no pacote compartilhado. Isso garante:
-   Sincronia de tipagem automática (E2E Type Safety).
-   Validação rigorosa tanto na entrada (API) quanto na saída (Proxy/Query).

### 3. Evolução da Persistência
-   A persistência local (IndexedDB) continua sendo o "Master" para operações offline e fluidez de UI.
-   A backend API assume a responsabilidade de ser o "Single Source of Truth" para dados sincronizados e consolidados.

## Governança de Mudança
-   A estrutura definida em `Estrutura_Monolito.md` é agora o padrão **obrigatório** para qualquer nova funcionalidade ou refatoração estrutural.
-   O arquivo `PROJECT_SUMMARY.md` deve refletir esta nova organização como a base da versão atual do sistema.

## Princípios de Migração
1.  **Higiene da Raiz (Legacy Isolation):** Como primeiro passo da migração, todos os diretórios e arquivos do projeto atual (não essenciais na raiz) serão movidos para uma pasta chamada `/legacy_project/`. Apenas os arquivos obrigatórios para o funcionamento da aplicação (como `server.ts`, `package.json`, `dist/`, etc.) permanecerão na raiz até que a transição para `/apps/web` e `/apps/api` seja concluída.
2.  **Obrigação de Preservação Integral:** É mandatório que 100% das funcionalidades, lógicas de negócio, integrações com Omie e dados persistidos no SQLite/IndexedDB existentes hoje sejam preservados sem alterações de comportamento. Esta transição é organizacional (diretórios), não funcional.
3.  **Preservação do Frontend:** A estrutura interna de `apps/web` deve manter os padrões da ADR 003 e as features atuais.
3.  **Modularidade na Backend:** A API deve seguir o padrão de módulos definido, evitando controladores "God Class" ou logic leak entre rotas.
4.  **Desenvolvimento Incremental:** Novas estruturas de backend devem ser adicionadas sem quebrar o fluxo de sincronização local atual (Local-First).

## Consequências
-   **Build:** O projeto agora requer ferramentas de gerenciamento de Monorepo (Turbo/pnpm/npm workspaces).
-   **Desenvolvimento:** Aumenta a complexidade inicial, mas reduz drasticamente o risco de inconsistência de dados entre frontend e backend no longo prazo.
