# Estrutura Canônica do Projeto

Este documento define a organização macro e o limite arquitetural das partes da aplicação de acordo com os padrões definidos pelo negócio. **NÃO ALTERE ESTA ESTRUTURA SEM AUTORIZAÇÃO**.

A arquitetura geral baseia-se em um modelo Monorepo adaptativo, mas em transição metodológica para um front-end moldado pelos conceitos do **Feature-Sliced Design (FSD)** e o backend dividido em módulos por Domínio (Bounded Contexts).

## 1. Backend (`apps/api/`)
A lógica de backend é estritamente isolada e não deve envolver UI ou React de nenhuma forma.
Segue o pilar de `Domain Driven Design (DDD)` somado à CLean Architecture simplificada orientada aos seguintes módulos:

```text
apps/api/src/
 ├── bootstrap/            # Configuração e injeção do server Express, Plugins e Rotas.
 ├── legacy/               # Código antigo que está sendo isolado para shutdown.
 ├── modules/              # Sub-módulo para cada Bounded Context (Domain).
 │    ├── [nome-do-modulo]/
 │    │    ├── application/    # Use Cases, Interfaces Repositories, DTOs
 │    │    ├── domain/         # Entidades puras, Types do negócio
 │    │    ├── infrastructure/ # Conexões Prisma, HTTP Axios, Repositórios Impl.
 │    │    └── presentation/   # Controllers e Rotas (HTTP layer)
 └── shared/               # Utils, Loggers, Middlewares inter-módulos e Erros Globais.
```
**Regras de Backend:**
- NUNCA referenciar um repositório entre módulos sem passar pelas camadas corretas de isolamento.
- UseCases recebem dependências via injeção (DIP).
- Acesso à API Externa Omie DEVE sempre ser intermediado pela `API 1` (Anti-Corruption Layer).

## 2. Frontend (`apps/web/`)
O Front-end está transicionando em partes de um modelo "features-folder-by-feature" para o **Feature-Sliced Design (FSD)**, começando estritamente pelos novos módulos e refatorações ordenáveis, como a interface de **Ordens de Produção FSD**.

### 2.1. Feature-Sliced Design (Novo Padrão Modular)
Todo o novo código estruturado ou refatorado será guiado pelos estratos abaixo. A importação e direção de conhecimento de negócio deve SEMPRE fluir de BAIXO (Shared) para CIMA (Pages). *É proibido camadas de baixo importarem artefatos das camadas de cima*.

```text
apps/web/src/
 ├── app/            # Camada Base de Inicialização: Configurações Globais, Providers e Router.
 ├── pages/          # Camada de Página Completa: Reune múltiplos Widgets. (Sabe pouco, agrupa muito).
 ├── widgets/        # Blocos UI Independentes: Composição significativa (Ex: Tabela c/ Navegação).
 ├── features/       # Lógica do Negócio / Interação Simples (Ex: Criar OP, Despachar Carrinho).
 ├── entities/       # Entidades do Domínio: UI Puro do Model, Store Global, e API/Queries Base.
 └── shared/         # Ferramental e UI System (Botões, APIs customizadas, Libs, Utils FSD).
```

### 2.2. Estrutura Legada (Modo Transição Restrito)
Arquivos que não migraram ainda permanecerão em:
```text
apps/web/src/features/   # Feature Completa contendo API, UI, Models juntos.
apps/web/src/hooks/      # Geração de queries React-Query engessadas
apps/web/src/components/ # Aglomerados de Base Components UI
```

## Regras de Transição e Migração
Toda nova feature FSD será construída via método de **Shadowing**, operando em paralelo com o código atual, até o momento da virada de rota (`Route Switch`), a fim de isolamento e detecção de riscos ao refatorar as bases da aplicação, e garantir conformidade com a Regra 13 (*Nenhuma etapa pode quebrar o sistema em produção*).
