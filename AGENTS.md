
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


