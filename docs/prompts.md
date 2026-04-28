Perfeito — você quer **prompts prontos** (copy/paste) para usar com o agente, de forma que:

*   a ADR **não fique genérica**
*   a estrutura do projeto fique **explicitamente “congelada”** (anti-generalização)
*   o agente **saiba como criar, aplicar e manter** (sem “reinterpretar”)
*   e tudo siga seu princípio de **responsabilidade única + granularidade fina + testes**

> Nota rápida: eu tentei localizar no seu ambiente arquivos como `AGENTS.md`, `PROJECT_SUMMARY.md` e uma pasta `docs/adr`, mas não encontrei resultados relevantes (vieram arquivos não relacionados).  
> Então abaixo vai um **kit independente do repo**, que você cola no agente e ele gera os arquivos.

***

# ✅ KIT DE PROMPTS (ANTI‑GENERALIZAÇÃO) — ADR + GUIA OPERACIONAL + ROTINA

## PROMPT 0 — “Modo ADR” (cole no início de qualquer conversa com o agente)

Esse prompt coloca o agente no modo certo **antes de qualquer tarefa**:

```text
MODO ADR ATIVO

A ADR “Encerramento da Migração Estrutural” está em vigor.
Você deve tratar a ADR + Guia Operacional como lei do projeto.

Regras:
1) Você deve citar explicitamente a seção da ADR/Guia usada para justificar cada decisão.
2) Você não pode generalizar a estrutura do projeto: use o “shape” definido abaixo como fonte de verdade.
3) Você não pode alterar, estender ou reinterpretar a ADR/Guia.
4) Se houver conflito entre uma solicitação e a ADR/Guia, pare e sinalize.

Agora confirme entendimento em 5 linhas (no máximo) e não faça mais nada até eu pedir.
```

***

## PROMPT 1 — Criar a ADR (com estrutura explícita “congelada”)

> Use para mandar o agente **redigir o arquivo ADR** (texto Markdown), sem mexer em código.

```text
TAREFA: REDIGIR ADR (somente texto, sem executar nada)

Você vai REDIGIR a ADR “ADR-003 — Encerramento da Migração Estrutural”.
Você NÃO pode executar refatoração, NÃO pode mover arquivos, NÃO pode alterar código.

OBJETIVO
Registrar oficialmente:
- Encerramento da migração estrutural ampla
- Estrutura oficial do projeto (sem generalização)
- Princípio global de responsabilidade única + granularidade fina
- Testabilidade como indicador estrutural

CONTEÚDO OBRIGATÓRIO (em Markdown)

1) Status, Data, Contexto
- Arquitetura: Feature-based + Use Cases
- Motivação humana: autonomia sem IA; qualquer pessoa deve conseguir manter
- UI/UX não deve mudar por refatoração

2) DEFINIÇÃO EXPLÍCITA DA ESTRUTURA (NÃO GENERALIZAR)
Inclua literalmente este “shape” como estrutura oficial:

/src
  /app                (bootstrap/composição global: Router, Providers, Guards, Boundaries)
  /components
    /layout            (layout shared)
    /ui                (design system shared)
    /auth              (componentes visuais apenas, sem regra)
  /pages               (composição de features e UI — sem regra de negócio pesada)
  /hooks
    /api               (bridges de tanstack query — delegam para features)
    /planner            (ponte; delegar sempre que possível)
    /products           (ponte; sem regra pesada)
  /services
    /api               (baixo nível: client/endpoints; sem regra de negócio)
  /types               (tipos globais; evitar duplicação com domain)
  /features
    /catalog            (somente Omie: buscar + normalizar)
    /products           (somente seleção/persistência local)
    /orders
    /planner
    /sectors
    /dashboard
    /auth               (esqueleto; fora de escopo por ora)

Para cada feature:

/src/features/<feature>
  /usecases            (ações pequenas: 1 intenção por arquivo)
  /domain              (regras puras + tipos do domínio)
  /infra               (adapters: chama services/api, storage, etc.)
  /state               (se necessário)
  index.ts             (exports públicos)

Regra: se houver muitos arquivos, permitir subpastas OBJETIVAS dentro de usecases/domain/infra/state
(ex: usecases/query, usecases/selection, infra/http, infra/storage). Proibido criar novas camadas.

3) DEFINIÇÕES “ANTI‑GENERALIZAÇÃO” (domínio explícito)
Incluir como regra do projeto:

- catalog = dados que VÊM do Omie (fetch + paginação + normalização)
- products = seleção local em cima do catálogo (persistência/estado local)
- products NÃO chama Omie diretamente
- catalog NÃO conhece seleção local

4) O que é “refatoração estrutural ampla” (proibida sem autorização)
Liste exemplos concretos proibidos:
- reorganizar diretórios base (src/app, src/pages, src/hooks, src/services)
- mover múltiplas features ao mesmo tempo
- consolidar camadas / criar “core/shared” novo
- renomear convenções globais
- “limpeza geral” de imports/exports em massa

5) O que é permitido sem autorização (refatoração local)
- criar arquivos pequenos de responsabilidade única na estrutura existente
- dividir arquivo grande em arquivos menores dentro da MESMA feature/pasta
- criar subpastas objetivas quando houver volume
- adicionar testes unitários para código novo/alterado

6) Princípios fundamentais (globais)
- Responsabilidade única por arquivo (todo o projeto)
- Granularidade fina (preferir muitos arquivos pequenos a arquivos grandes)
- Proibir “utils genérico” gigante
- Testabilidade como indicador estrutural (se é difícil testar, está grande demais)
- UI/UX intocável em refatorações

7) Consequências / como trabalhar daqui pra frente
- Novas mudanças seguem o padrão, sem reorganização ampla
- Código legado é tocado somente por necessidade funcional
- Qualquer exceção exige nova decisão formal

FORMATO DE ENTREGA
Responda APENAS com o Markdown final do ADR completo, pronto para salvar em:
docs/adr/ADR-003-encerramento-migracao-estrutural.md
```

***

## PROMPT 2 — Criar o Guia Operacional (para humanos + agentes)

> Isso vira o “manual executável”. Sugestão de arquivo: `AGENTS.md` ou `docs/architecture/WORKING_RULES.md`.

```text
TAREFA: REDIGIR GUIA OPERACIONAL (somente texto, sem executar nada)

Você vai criar um Guia Operacional derivado da ADR-003.
Você NÃO vai alterar código nem mover arquivos.

OBJETIVO
Evitar interpretações vagas. Este guia deve permitir manutenção por humanos sem IA.

CONTEÚDO OBRIGATÓRIO (em Markdown)

A) “Preflight Checklist” (toda PR/tarefa começa aqui)
- Qual feature?
- UI/UX muda? (se sim, justificar e pedir autorização)
- Isso é refatoração estrutural ampla? (se sim, parar)
- Qual é a menor mudança possível?
- Quais testes cobrem?

B) Regras “Pode / Não pode”
- Pode: criar arquivo pequeno SRP, dividir arquivo grande localmente, criar testes.
- Não pode: reorganização ampla, consolidar responsabilidades, criar camadas novas.

C) SRP Global e Granularidade
- 1 arquivo = 1 intenção
- preferir 5 arquivos de 20 linhas do que 1 de 200
- nomes explícitos (verbo + objeto)
- se começar a ficar genérico, dividir

D) Organização por volume (sem criar camadas)
- quando muitos arquivos: criar diretórios objetivos (usecases/query, usecases/selection, infra/http, etc.)
- proibido: core/shared novo; utils genérico

E) Política mínima de testes
- todo arquivo novo em features/*/(usecases|domain|infra) deve vir com teste unitário correspondente
- testes pequenos e focados
- se teste for difícil, dividir o código
- não adicionar libs de teste sem autorização

F) “Comportamento padrão do agente”
- sempre citar seção da ADR/Guia usada
- listar arquivos afetados antes de alterar
- parar se o escopo expandir ou se violar ADR

FORMATO DE ENTREGA
Responda APENAS com o Markdown final pronto para salvar em:
AGENTS.md  (ou docs/architecture/WORKING_RULES.md)
```

***

# ✅ ROTINA: Prompts para o dia a dia (tarefas sem generalização)

## PROMPT 3 — “Preflight + Escopo” (antes de qualquer implementação)

```text
ANTES DE IMPLEMENTAR:
1) Cite quais seções da ADR-003 e do Guia Operacional se aplicam aqui.
2) Classifique a tarefa:
   (a) mudança funcional
   (b) refatoração local permitida
   (c) refatoração estrutural ampla (PROIBIDA sem autorização)
3) Liste os arquivos que você pretende alterar (lista fechada).
Se precisar mexer fora da lista, pare e peça autorização.
Não escreva código ainda.
```

## PROMPT 4 — “Forçar SRP global” (qualquer alteração)

```text
REGRA SRP GLOBAL (obrigatória):
- Cada arquivo alterado/criado deve ter UMA responsabilidade clara.
- Prefira muitos arquivos pequenos e nomeados a poucos arquivos grandes.
- Explique em 1 frase a responsabilidade de cada arquivo que tocar.
Se qualquer arquivo passar a ter duas intenções, divida imediatamente.
```

## PROMPT 5 — “Anti‑generalização de estrutura”

```text
ANTI-GENERALIZAÇÃO:
Você deve respeitar a estrutura oficial definida na ADR-003.
Você NÃO pode propor novas camadas (core/shared/application/etc).
Você NÃO pode mudar o shape de pastas base (src/app, src/pages, src/hooks, src/services, src/features).
Qualquer necessidade de reorganização ampla deve ser sinalizada como conflito com a ADR.
```

## PROMPT 6 — “Política de testes (obrigatória)”

```text
TESTES (obrigatório):
- Todo arquivo novo em features/*/(usecases|domain|infra) deve vir com teste unitário correspondente.
- Testes devem ser pequenos e focados (1 intenção).
- Se um teste exigir setup complexo, refatore para reduzir acoplamento.
Antes de escrever testes, identifique o runner atual pelos scripts do package.json.
Não adicione dependências novas sem autorização.
```

## PROMPT 7 — “Bloqueio UI/UX”

```text
BLOQUEIO UI/UX:
Proibido alterar markup, CSS, classes, layout e design system em refatorações.
Se uma mudança visual for inevitável, pare e explique o motivo e o risco.
```

***

# ✅ Prompts específicos para evitar o “mega use case”

## PROMPT 8 — “Limite prático e divisão”

```text
LIMITES PRÁTICOS (heurística):
- Se um arquivo começar a crescer e misturar decisões, divida.
- Se o nome do arquivo ficar genérico (Process/Handle/Utils), divida.
- Se um use case passar de ~100-150 linhas, proponha divisão por intenção.
Proponha a divisão em arquivos pequenos com nomes explícitos e diretórios objetivos quando necessário.
Não consolide comportamentos diferentes no mesmo arquivo.
```

## PROMPT 9 — “Organização por diretórios objetivos quando houver muitos arquivos”

```text
ORGANIZAÇÃO POR VOLUME (permitida):
Se uma feature tiver muitos arquivos, organize SEM criar novas camadas:
- usecases/query/
- usecases/selection/
- usecases/sync/
- domain/normalization/
- infra/http/
- infra/storage/

Proibido:
- criar core/shared novo
- criar utils genérico
- mover código entre features sem autorização
```

***

# ✅ Extra: Prompt “Auditoria de conformidade” (quando quiser checar o projeto)

```text
AUDITORIA ADR/GUIA:
Avalie se o trabalho recente está aderente à ADR-003 e ao Guia Operacional.
Entregue um relatório curto com:
- Itens aderentes
- Possíveis violações (com motivo)
- Riscos (ex: duplicação hook vs use case)
Não proponha refatorações; apenas reporte.
```

***

## ✅ Respondendo sua dúvida: “ADR deve definir a estrutura?”

**Sim.** E do jeito que está no PROMPT 1: com o *shape literal* e com as definições `catalog vs products`. Isso **mata a chance de generalização** e impede o agente de inventar “camadas novas” por padrão.

***

## Como você usa isso na prática (sequência)

1.  Cole **PROMPT 1** → agente gera o texto da ADR
2.  Cole **PROMPT 2** → agente gera o Guia Operacional
3.  Em qualquer tarefa futura, comece por **PROMPT 0 + PROMPT 3**
4.  Durante a implementação: **PROMPT 4 + 6 + 7** conforme necessário

Se você quiser, eu também posso te fornecer uma versão “com palavra‑chave” (tipo **EXECUTAR\_ETAPA4\_OK**) para impedir qualquer execução sem senha — mas com esse kit acima você já reduz MUITO o risco do agente “tomar liberdade”.
