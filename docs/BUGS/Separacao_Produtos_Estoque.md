# Objetivo: Separação de Nomenclatura entre Produtos (Catálogo Omie) e Estoque Local

## Descrição do Problema
Atualmente, existe uma sobreposição de responsabilidades e ambiguidade no uso da nomenclatura `products`. Tanto o front-end quanto o back-end (em `apps/api/src/modules/products`) lidam simultaneamente com:
1. Produtos brutos vitrine (Catálogo via Omie).
2. Produtos com lógica de manufatura local / saldos (Estoque).

Essa falta de isolamento semântico viola os princípios estabelecidos no projeto de *Granularidade* e *Crescimento Orgânico*.

## Passos para Refatoração (Plano de Ação Seguro - Sem Quebrar a Aplicação)

- [ ] **Passo 1: Criação da Nova Estrutura no Backend (Em Paralelo)**
      - Criar a nova pasta de domínio `modules/stocks` (Adapter, UseCases, Repositories, Controllers) com os padrões corretos, sem apagar, renomear ou modificar o módulo antigo `modules/products`.
      - Criar o módulo `modules/catalog` focado puramente no Omie, também de forma isolada.
      *Status: Aguardando aprovação.*

- [ ] **Passo 2: Registro de Novas Rotas (API/Routes)**
      - Registrar as novas rotas `/api/stocks` e `/api/catalog` (ex: no server/bootstrap), mantendo as antigas `/api/products` intactas e ativas.
      - Testar detalhadamente os endpoints novos para garantir o funcionamento com o banco e integrações.
      *Status: Aguardando aprovação.*

- [ ] **Passo 3: Espelhamento e Refatoração no Frontend (A Virada de Chave)**
      - Copiar/Adicionar a estrutura necessária em `apps/web/src/features/stocks` e `features/catalog`.
      - Substituir as importações e chamadas HTTP de `/api/products` para as novas versões `/api/stocks` no Frontend.
      - Executar testes para confirmar que a interface continua operando com as novas fontes de dados.
      *Status: Aguardando aprovação.*

- [x] **Passo 4: Clean-up (Limpeza) e Documentação (Ponto Seguro)**
      - Excluir a estrutura antiga `apps/web/src/features/products` e `apps/api/src/modules/products`.
      - Registrar a nova arquitetura de estoques e catálogo no `PROJECT_SUMMARY.md`.
      *Status: PRONTA!*

*(Nota: Toda atualização concluída e testada será marcada como **PRONTA!** no final de cada respectivo passo).*