
## Instruções para Agentes de IA

Este documento define regras obrigatórias, inegociáveis e cumulativas para qualquer Agente de IA que atue neste repositório.

Qualquer violação destas regras é considerada erro grave de processo.

Este projeto utiliza documentação viva.
Nada é considerado concluído sem documentação adequada.

Arquivo central da verdade técnica:
- PROJECT_SUMMARY.md

## 0. Regra Fundamental de Autoridade

Sempre que uma solicitação não for claramente compatível com estas regras, o agente DEVE parar e perguntar.

É proibido:
- Assumir intenção do usuário
- Improvisar soluções fora do padrão definido

Princípios:
- Estabilidade acima de automação
- Resolver um problema por vez
- Criar primeiro, integrar depois

## 1. Regra de Comandos do Usuário (Palavras‑Chave de Controle)

Toda interação qu commeçar com: Conversa:
- É proibido codar
- Pode ler arquivos somente isso
- Responder somente via chat
- Nenhum arquivo pode ser criado ou alterado
- Mesmo que dê a entender que é para codar, não code quando tiver o Conversa: no inicio da mensagem
Perguntas que terminarem com "documente!":
- É proibido codar
- Investigar o problema na aplicação
- Criar ou editar documento em docs/BUGS
- Nome do arquivo deve ser objetivo
- Descrever problema, causa e passos realizados
- Marcar cada passo concluído e testado como PRONTA
- Apresentar o relatório no chat
- Aguardar decisão explícita do usuário

## 2. Regra de Centralização da Documentação (docs/)

O diretório docs/ é a fonte única, obrigatória e oficial de documentação do projeto.

É proibido:
- Considerar documentação apenas no chat
- Considerar documentação apenas no código
- Criar documentação fora de docs/

Toda decisão técnica, correção, implementação ou mudança estrutural
deve possuir registro em docs/.

## 3. Regra de Governança das Regras de Negócio

As regras de negócio ativas DEVEM estar em:
- docs/regras_negocio/README.md

Esse arquivo representa a versão vigente das regras.

É obrigatório:
- Versionar regras em docs/regras_negocio/versoes
- Nunca alterar versões antigas
- Manter histórico de mudanças (changelog)

## 4. Regra de Registro de Alterações

Toda alteração no sistema DEVE ser registrada.

Tipos de alteração:
- Implementação de funcionalidade
- Correção de bug
- Ajuste técnico relevante

Cada alteração deve possuir documentação própria,
permitindo rastreabilidade histórica.
Cada Alteração deve seguir passo a passo, definir os passos e aguardar a aprovação fazendo passo por vez.

## 5. Regra de Implementações (Responsabilidade Única)

Uma implementação resolve UM único problema.

É obrigatório:
- Alterar poucos arquivos
- Não misturar múltiplos objetivos
- Documentar em docs/implementacoes
- Versionar incrementalmente (vX.Y.Z)
- Nunca sobrescrever versões antigas

Sempre utilizar TDD.

## 6. Regra de Correções de Bugs

Toda correção de bug DEVE ser registrada em:
- docs/correcoes/historic_bugs

O registro deve conter:
- Descrição do bug
- Causa raiz
- Como foi corrigido
- Como evitar no futuro
- Nunca introduzir um "Sucesso Falso

## 7. Regra de Auto‑Atualização da Documentação Viva

Sempre que houver alteração em:
- Estrutura de arquivos
- Arquitetura técnica
- Lógica de negócio
- Endpoints
- Integrações externas
- Webhooks, jobs ou persistência

O agente DEVE:
- Atualizar PROJECT_SUMMARY.md
- Incrementar versão corretamente
- Atualizar a data

Nenhuma funcionalidade é considerada concluída sem isso.

## 8. Regra de Estabilidade Absoluta da Aplicação

É proibido quebrar a aplicação.

É proibido:
- Remover endpoints existentes sem autorização
- Alterar contratos de APIs sem validação

Refatorações devem ser:
- Incrementais
- Seguras
- Criando novo antes de substituir o antigo

## 9. Regra de Foco, SRP Global e TDD

Princípios obrigatórios:
- 1 arquivo = 1 intenção
- Buscar, normalizar e persistir são responsabilidades distintas
- Arquivos grandes devem ser fragmentados
- Evitar mudanças longas e abrangentes

Toda nova funcionalidade deve ser feita com TDD.

## 10. Regra de Padrão de UI para Listagens

Listagens devem seguir padrão visual consistente:

- Feedback visual simples em hover
- Padding adequado nas células
- Dados primários e secundários empilhados
- Ações visíveis apenas no hover

O padrão de referência é a tela de Metas.

## 11. Regra de Protocolo de Resposta do Agente

Toda resposta técnica DEVE iniciar com:
- Citação da regra ou guia respeitado
- Classificação da mudança:
  - Implementação funcional
  - Refatoração local
  - Refatoração estrutural (proibida sem autorização)
- Lista de arquivos afetados
- Bloqueio de escopo, se aplicável

## 12. Regra de Refatoração Incremental e Segura

Toda refatoração deve:
- Preservar o funcionamento do sistema
- Ser feita em partes pequenas
- Manter compatibilidade durante o processo

Criar antes de trocar.
Nunca refatorar tudo de uma vez.

## 13. Regra de Migração Controlada do Frontend (apps/web)

O diretório `apps/web` é o local oficial e exclusivo do frontend da aplicação.

Toda a migração do frontend DEVE ocorrer exclusivamente dentro de `apps/web`,
sem impactar o funcionamento do sistema existente até a conclusão de cada etapa.

adotaremos o Feature-Sliced Design (FSD) e o usaremos sob o padrão de "Shadowing
### Princípios Obrigatórios

- A migração deve ser progressiva (shadowing).
- O frontend antigo DEVE continuar funcionando até a virada de chave.
- Nenhuma etapa pode quebrar o sistema em produção.
- Cada etapa concluída DEVE ser explicitamente marcada como ATUALIZAÇÃO ENTREGUE.

### Limites Estruturais

- É proibido criar código de frontend fora de `apps/web`.
- É proibido mover arquivos diretamente do frontend antigo para `apps/web`
  sem cópia e validação prévia.
- É proibido criar estruturas paralelas ou atalhos fora do padrão definido.

### Relação com a Estrutura Canônica

A migração do frontend DEVE respeitar integralmente a
Regra 14 (Estrutura Canônica do Projeto),
conforme definido em `docs/Estrutura_Projeto.md`.

Nenhuma variação estrutural é permitida além do que está documentado.

### Documentação Obrigatória

- Cada etapa da migração DEVE ser documentada.
- O `PROJECT_SUMMARY.md` DEVE ser atualizado ao final de cada etapa.
- O `AGENTS.md` DEVE refletir o status atualizado da migração.

Qualquer necessidade de mudança estrutural não prevista
DEVE interromper o processo e solicitar autorização explícita.

## 14. Regra de Estrutura Canônica do Projeto

A estrutura oficial do projeto é definida exclusivamente em
`docs/Estrutura_Projeto.md`.

Esse arquivo é a fonte única de verdade sobre:
- Organização de diretórios
- Padrão de módulos
- Limites estruturais
- Áreas extensíveis e áreas proibidas

É expressamente proibido:
- Inferir estrutura fora do que está documentado
- Criar pastas, módulos ou camadas não previstas
- Alterar a organização estrutural do projeto

Qualquer necessidade de mudança estrutural
DEVE ser solicitada explicitamente antes da execução.

Todas as regras que envolvem implementação, refatoração
ou migração DEVEM respeitar esta regra.

## 15. Regra de Refatoração Controlada da API (apps/api)

O diretório `apps/api` é o local oficial e exclusivo do backend da aplicação.

Qualquer refatoração no backend DEVE preservar integralmente:
- O comportamento dos endpoints existentes
- Os contratos de entrada e saída (payloads)
- Os códigos de resposta HTTP
- A compatibilidade com consumidores externos

### Princípios Obrigatórios

- Refatorações DEVEM ser incrementais e seguras.
- Criar o novo antes de substituir o antigo.
- Nunca refatorar grandes áreas de uma só vez.
- Cada refatoração deve resolver um problema específico.

### Limites Estruturais

- É proibido alterar a estrutura do backend fora do padrão definido.
- É proibido mover arquivos entre camadas sem necessidade explícita.
- É proibido reorganizar módulos existentes durante refatorações locais.
- É proibido remover endpoints, rotas ou integrações ativas.

### Relação com a Estrutura Canônica

Toda refatoração da API DEVE respeitar integralmente a
Regra 14 (Estrutura Canônica do Projeto),
conforme definido em `docs/Estrutura_Projeto.md`.

Nenhuma refatoração pode introduzir variação estrutural
não documentada ou não autorizada.

### Testes e Validação

- Logs DEVEM ser verificados durante e após a refatoração.
- Testes existentes DEVEM continuar passando.
- Novos testes DEVEM ser adicionados quando necessário.
- A aplicação DEVE estar funcional ao final do processo.

Qualquer necessidade de refatoração estrutural no backend
DEVE interromper o processo e solicitar autorização explícita.

## 16. Regra de Observabilidade e Logs (Produção)

O sistema DEVE possuir logs suficientes para garantir observabilidade,
diagnóstico e rastreabilidade em ambiente de produção.

Logs existem para:
- Diagnosticar falhas
- Entender comportamento do sistema
- Auditar decisões técnicas relevantes

Logs NÃO existem para:
- Substituir tratamento de erro
- Mascarar falhas
- Registrar dados sensíveis
- Registrar tudo indiscriminadamente

### Níveis de Log

O uso de níveis é obrigatório:

- DEBUG: detalhes técnicos de desenvolvimento (não usar em produção)
- INFO: eventos relevantes do fluxo normal
- WARN: situações anômalas recuperáveis
- ERROR: falhas que afetam o fluxo esperado
- FATAL: falhas que impedem continuidade do sistema

### O que DEVE ser logado

- Entrada e saída de fluxos críticos
- Chamadas a integrações externas
- Decisões de negócio relevantes
- Erros capturados (com contexto)
- Tentativas bloqueadas por regra
- Eventos de idempotência
- Falhas de validação de contrato

### O que NÃO DEVE ser logado

- Payloads completos de requisição ou resposta
- Dados sensíveis (tokens, senhas, documentos)
- Loops, polling ou fluxos de alta frequência
- Logs redundantes em cada camada
- Logs apenas para "marcar presença"

### Logs NÃO substituem tratamento de erro

É proibido:
- Apenas logar e seguir o fluxo silenciosamente
- Engolir erros sem decisão explícita
- Depender de logs para manter o sistema estável

Todo erro deve:
- Ser tratado corretamente
- Ser logado apenas uma vez
- Retornar comportamento previsível ao consumidor

### Relação com outras regras

- Logs DEVEM respeitar a Regra 6 (Estabilidade Absoluta)
- Logs DEVEM respeitar a Regra 7 (SRP e Foco)
- Logs DEVEM respeitar a Regra 14 (Estrutura Canônica)
- Logs DEVEM existir tanto em apps/api quanto em integrações externas

### Regra de Ouro

Se um erro só pode ser entendido olhando logs,
então o sistema está mal projetado.

Logs ajudam a investigar.
Eles NÃO corrigem arquitetura ruim.

## 17. Regra de Escopo de Leitura e Levantamento de Regras

O agente NÃO DEVE percorrer, ler ou analisar todo o projeto por padrão.

Toda atuação do agente DEVE ocorrer dentro de um escopo explícito,
definido pela solicitação do usuário ou pela regra que está sendo aplicada.

### Escopo para Levantamento de Regras de Negócio

Ao listar, revisar ou criar versões das Regras de Negócio, o agente DEVE:

- Basear-se apenas em regras já explicitadas pelo usuário,
  documentação existente e decisões previamente acordadas.
- Descrever o comportamento esperado do sistema,
  não detalhes de implementação.
- Evitar inferir regras a partir de código, pastas ou padrões técnicos.
- Tratar regras implícitas como suspeitas,
  solicitando validação antes de registrá-las.

É proibido:
- Varrer o código para “descobrir” regras de negócio
- Inferir regra de negócio a partir de if/else ou validações técnicas
- Misturar regra técnica com regra de domínio
- Criar regras novas durante o levantamento da v1

### Escopo Geral de Leitura

Na ausência de instrução contrária, o escopo permitido é:
- Documentação em `docs/`
- Regras explicitadas no AGENTS.md
- Regras explicitadas pelo usuário no chat
- Arquivos explicitamente mencionados

### Ampliação de Escopo

Se o agente identificar necessidade de ampliar o escopo de leitura,
DEVE parar e solicitar autorização explícita,
informando exatamente o que deseja analisar e por quê.



## 18. Regra de Protocolo de Build e Configuração (Deploy)

As configurações de build representam o principal ponto de falha para deployments na nuvem.
O comportamento do build e do mapeamento de arquivos gerados (artefatos) DEVE ser estritamente preservado.

### Diretório Unificado de Artifacts (`dist/` na raiz)
- O único local aceitável para *build artifacts* finais do ambiente e de toda a SPA é o diretório `dist` na **raiz** do projeto (Root `dist/`).
- O frontend no Vite DEVE apontar sempre para a raiz, configurando no seu respectivo `vite.config.ts` o outDir adequado (ex: `outDir: '../../dist'`).
- É TERMINANTEMENTE PROIBIDO exportar assets do frontend para subdiretórios restritos (ex: `apps/web/dist`). O AI Studio Build System confia na estrutura central.

### Entrypoints (Full-Stack Integrado)
- A aplicação é servida no pacote gerado a partir do `dist/server.cjs` ou injetado via entrypoint central, como `server.ts`. 
- Caso o script de start (`"start"`) no `package.json` esteja utilizando `"node server.ts"` consumindo a aplicação compilada, isso DEVE ser respeitado e preservado sem renomeações inconsequentes ou remoções de path.
- O App de API gerencia como arquivos estáticos são servidos, e este roteamento `app.use(express.static(...))` obrigatoriamente tem de apontar para a pasta que contém o `index.html` e *assets* (o unificado root `dist/`).

### Teste de Build
- Se o agente alterar qualquer biblioteca de bundler (ex: vite, esbuild) ou manipular caminhos que refletem ao output, é OBRIGATÓRIO verificar a resiliência chamando o build. Se houver falha na geração dos artefatos (Artifacts array empty), a correção é emergencial antes de qualquer implementação.
- Não quebre os scripts do `package.json`.

## 19. Regra de Documentação e Versionamento de Páginas (docs/paginas)

Toda vez que uma nova interface/página for criada, ou quando o fluxo de uma página existente sofrer refatoração pesada, a documentação relacionada em `docs/paginas/` DEVE ser obrigatoriamente criada ou atualizada.

Diretrizes obrigatórias:
- A documentação deve respeitar a estrutura do template base presente em `docs/paginas/README.md`.
- É obrigatório o versionamento SemVer (v1.0.0, v1.1.0, etc.) em todos os arquivos de páginas, registrando a versão atual no título do arquivo (Ex: `# Production Control - v1.0`).
- Ao realizar refatorações ou alterar uma página existente, a versão base (anterior à sua mudança) DEVE ser arquivada para um subdiretório de histórico (ex: `docs/paginas/historico_nomedapagina/vX.0.0.md`). Nunca sobreponha um arquivo importante de documentação de design/fluxo sem antes registrar sua forma anterior.
## 20 Migração Duas api's usando o mesmo banco Arquivo para sempre ler
- AGENTS_MIGRATION.md

## Regra Final de Governança

Nenhuma automação vale mais que a estabilidade.
Nenhuma entrega é válida sem documentação.
Em caso de dúvida: parar e perguntar.


# Como funciona nosso sistema api1, ap2 suando o mesmo banco de dados e suas devidas responsabilidades


## ✅ Forma correta

> **API 1 é o core de integração e consistência externa do sistema**

Isso parece detalhe semântico, mas **evita decisões erradas depois**.

***

## 🧠 Papel real da API 1

A API 1 é:

* ✅ **Anti‑corruption layer**
* ✅ **Adapter entre domínio interno e Omie**
* ✅ **Dona do read‑model**
* ✅ **Responsável por sincronização**
* ✅ **Responsável por refletir mudanças no Omie**

Ela **protege o sistema** das inconsistências, regras estranhas e contratos instáveis do ERP.

***

## 🔧 O que a API 1 faz (agora e no futuro)

### ✅ Agora

* Sync de produtos
* Sync de estruturas (BOM)
* Sync de pedidos
* Backfill
* Read‑model organizado
* Endpoints de leitura

### ✅ No futuro (como você descreveu)

* Criar OP no Omie
* Editar OP no Omie
* Cancelar OP no Omie
* Reconciliar divergências
* Garantir idempotência
* Traduzir comandos → payload Omie
* Tratar erro externo
* Retry, timeout, compensação

👉 **Tudo isso é API 1**

***

## ✅ O que a API 1 **NÃO** é

Isso é importante para não confundir:

* ❌ Não é UI
* ❌ Não é frontend
* ❌ Não é onde nasce a regra de negócio
* ❌ Não é onde o usuário “decide” algo
* ❌ Não é onde o fluxo de domínio começa

Ela **executa**, **traduz**, **sincroniza** — não decide.

***

## ✅ Onde está o “core de negócio” então?

### ✅ Core de negócio = **API 2**

A API 2 é quem:

* decide *quando* criar OP
* decide *se* pode criar OP
* valida regras internas
* orquestra o fluxo
* entende o processo produtivo

Mas…

👉 **API 2 nunca fala com Omie direto**  
👉 **API 2 nunca sabe nomes Omie**  
👉 **API 2 nunca monta payload externo**

Ela **manda intenção**, a API 1 **executa**.

***

## 🔁 Exemplo completo (futuro)

### Usuário

> “Quero editar uma ordem de produção”

### Fluxo correto

```
UI
 ↓
API 2
  - valida regra
  - monta comando
 ↓
API 1
  - traduz comando → Omie
  - chama Omie
  - trata erro
  - garante idempotência
 ↓
Omie
```

✅ Exatamente como você descreveu.

***

## ✅ Por que sua intuição está certa

Você já está pensando em:

* consistência
* impacto externo
* isolamento
* evolução futura
* manutenção real

Isso é **engenharia de sistema vivo**, não CRUD.

***

## ✅ Regra de ouro para guardar

> **Toda interação com o Omie — presente ou futura — passa pela API 1.**
>
> **Toda decisão de negócio nasce fora dela (API 2).**

Se você guardar isso, **não vai errar a arquitetura**.




## ✅ Correção importante (alinhamento fino)

Você **está certo** no que sempre pensou:

> **Existe UM banco de dados compartilhado**, usado pelas duas APIs.  
> O que muda **não é o banco**, é **quem é dono de cada tipo de dado**.

Quando eu disse antes que *“o banco pertence à API 1”*, a frase correta seria:

> **O banco de INTEGRAÇÃO pertence à API 1.**

Isso é diferente de dizer que:

* API 2 não grava nada ❌
* API 2 não tem tabelas próprias ❌

Vamos separar corretamente.

***

## ✅ Modelo correto (definitivo)

### 🔹 Banco de dados: **único e compartilhado**

✅ Sim, **é o mesmo banco físico**  
✅ Sim, **ambas as APIs usam**  
❌ Não é um banco “exclusivo” da API 1

***

## ✅ A divisão REAL é por **ownership de dados**

### 🟦 API 1 — **Dona dos dados de integração**

A API 1 é dona de tudo que:

* vem do Omie
* representa estado externo
* precisa ser reconciliado
* precisa de idempotência externa
* é read‑model de integração

**Exemplos:**

* `omie_orders`
* `omie_order_items`
* `omie_products`
* `omie_clients`
* `omie_production_orders`
* `sync_locks`
* hashes, códigos Omie, payloads crus

📌 **Só a API 1 pode escrever nesses dados.**

***

### 🟩 API 2 — **Dona dos dados de domínio**

A API 2 é dona de tudo que:

* nasce de decisão humana
* representa regra de negócio
* não existe no Omie
* pode mudar sem Omie
* pertence ao planejamento interno

**Exemplos:**

* metas
* planos de produção
* favoritos
* agrupamentos
* prioridades
* status internos
* auditorias de decisão
* histórico de comandos

📌 **A API 2 pode escrever diretamente no banco nessas tabelas.**

***

## ✅ Visual claro (guarde isso)

```
┌──────────────────────────┐
│        MESMO BANCO       │
│                          │
│  ┌───────────────┐       │
│  │  API 1 (ACL)  │──────▶│  Tabelas Omie / Integração
│  └───────────────┘       │
│                          │
│  ┌───────────────┐       │
│  │ API 2 (Dom.)  │──────▶│  Tabelas de Domínio
│  └───────────────┘       │
│                          │
└──────────────────────────┘
```

ACL = Anti‑Corruption Layer

***

## ✅ Regras de ouro (não negociáveis)

### ✅ API 1

* ✅ escreve **dados Omie**
* ✅ reconcilia
* ✅ faz backfill
* ✅ traduz payload
* ✅ protege o domínio

### ❌ API 1 NÃO

* ❌ cria metas
* ❌ cria planos internos
* ❌ decide negócio
* ❌ grava intenção humana

***

### ✅ API 2

* ✅ cria metas
* ✅ cria planos
* ✅ cria comandos (OP)
* ✅ grava decisões humanas
* ✅ usa read‑model da API 1

### ❌ API 2 NÃO

* ❌ grava dados Omie
* ❌ traduz payload Omie
* ❌ chama Omie direto
* ❌ conhece campos Omie

***

## ✅ Aplicando isso à sua pergunta (metas)

> **Metas devem ser API 2?**  
> ✅ **Sim. 100%.**

> **Quem grava metas no banco?**  
> ✅ **API 2 grava diretamente.**

> **API 1 participa?**  
> ❌ Não.

***

## ✅ Aplicando isso à OP (que vem agora)

* API 2:
  * valida regra
  * decide criar OP
  * grava intenção (se quiser)
* API 1:
  * traduz
  * chama Omie
  * grava retorno Omie

✅ Cada uma grava **o que é sua responsabilidade**  
✅ No **mesmo banco**, sem conflito

***

## ✅ Conclusão final (corrigindo a frase antiga)

A frase correta para guardar é:

> **O banco é compartilhado.  
> A API 1 é dona dos dados de integração.  
> A API 2 é dona dos dados de domínio.**

DATABASE_FINAL_URL= Banco de dados final do projeto
LEGACY_DATABASE_URL= Banco de dados que o frontend e api2 usam para criar e lidar com dados de dominio e etc, será organizado nele para no futuro termos a migração suave para o db final com tudo ja preparado.








