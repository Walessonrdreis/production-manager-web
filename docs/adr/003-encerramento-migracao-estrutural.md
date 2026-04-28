# ADR 003: Encerramento da Migração Estrutural

**Status:** Aceito  
**Data:** 2026-04-28  
**Arquitetura:** Feature-based + Use Cases

## Contexto e Objetivo
Este registro oficializa o encerramento da fase de migração estrutural ampla do projeto. O sistema agora opera sob um modelo de **responsabilidade única** e **granularidade fina**, onde cada pedaço de lógica de negócio está isolado em módulos específicos (features).

O objetivo principal desta organização é a **manutenção humana**: garantir que qualquer desenvolvedor (ou o proprietário do projeto) consiga navegar, entender e modificar o código sem dependência exclusiva de ferramentas de IA. A estrutura foi desenhada para ser previsível e intuitiva, preservando a fidelidade da UI/UX original.

---

## Definição de Estrutura (Shape "Congelado")

A estrutura de diretórios abaixo é a referência oficial e **não deve ser generalizada ou alterada** sem uma nova ADR.

### 1. Diretórios Globais (`/src`)
-   **/app**: Ponto de entrada e bootstrap. Contém composição global: Router, Providers, Guards e Error Boundaries.
-   **/components**:
    -   `/layout`: Estruturas de página compartilhadas (Sidebar, Topbar).
    -   `/ui`: Design System e componentes atômicos (Button, Input, Card).
    -   `/auth`: Componentes puramente visuais de autenticação.
-   **/pages**: Composição de features e elementos de UI de página. Não deve conter lógica de negócio complexa.
-   **/hooks**:
    -   `/api`: Pontes para o TanStack Query que delegam a execução para os `usecases` das features.
    -   `/planner` / `/products`: Hooks utilitários de ponte (em transição para delegar lógica pesada às features).
-   **/services**: Camada de infraestrutura de baixo nível. Contém o client da API e definições de endpoints. Sem regras de negócio.
-   **/types**: Definições de tipos e interfaces globais.

### 2. Camada de Features (`/src/features`)
Cada feature é um domínio isolado com o seguinte shape obrigatório:

```text
/src/features/<feature_name>
  ├── usecases/       # Ações pequenas e granulares (1 intenção por arquivo)
  ├── domain/         # Regras puras, tipos de domínio e normalização
  ├── infra/          # Adapters (chamadas de API, IndexedDB, DB Local)
  ├── state/          # Estado local da feature (Zustand/Context se necessário)
  └── index.ts        # Exportação da interface pública da feature
```

**Nota sobre granulidade:** Se uma feature possuir muitos usecases, é permitida a criação de subpastas objetivas (ex: `usecases/query/`, `usecases/sync/`), desde que não introduzam novas camadas arquiteturais.

---

## Governança de Refatoração

### Proibido (Necessita Autorização/ADR):
-   Mover pastas de grande porte ou renomear diretórios base da estrutura.
-   Alterar convenções arquiteturais (ex: remover a pasta `usecases`).
-   Reorganizar múltiplas features simultaneamente.
-   Alterar contratos públicos de features de forma abrangente ("limpeza" estética).

### Permitido (Ação Autônoma):
-   Criar arquivos pequenos com responsabilidade única dentro da estrutura existente.
-   Dividir um arquivo grande em múltiplos arquivos menores dentro do mesmo módulo/feature.
-   Criar testes unitários/integração junto ao código.
-   Criar subpastas organizacionais dentro de `usecases`, `domain` ou `infra` quando o volume de arquivos justificar.

---

## Princípios Fundamentais
1.  **Responsabilidade Única (SRP):** Um arquivo, uma função clara. Evitar exportar múltiplas lógicas de negócio no mesmo arquivo.
2.  **Granularidade Fina:** Preferir muitos arquivos pequenos e bem nomeados a poucos arquivos grandes e genéricos.
3.  **Proibição de "Mega-Utils":** Proibido criar arquivos como `utils.ts` com centenas de linhas de funções não correlacionadas.
4.  **Testabilidade:** A estrutura deve facilitar o teste. Se um componente ou usecase é difícil de testar, ele está grande demais e deve ser fragmentado.
5.  **Preservação de UI/UX:** Refatorações estruturais nunca devem alterar o comportamento visual ou a experiência do usuário final.

---

## Consequências e Próximos Passos
-   **Novas Features:** Devem ser criadas seguindo rigorosamente o padrão de shape definido.
-   **Código Legado:** Partes do sistema que não seguem o padrão atual só serão tocadas quando houver necessidade técnica de evolução, seguindo o princípio do "Escoteiro" (deixar o código um pouco melhor do que encontrou).
-   **Motivação Técnica:** Toda refatoração futura deve ser motivada por necessidade funcional ou técnica clara, nunca por preferência estética subjetiva.
