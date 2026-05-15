# Documento de Regras de Negócio

## 1. Cabeçalho
- **Versão:** v1.0.0
- **Data:** 2026-05-13
- **Status:** DRAFT / PENDENTE DE PREENCHIMENTO
- **Escopo:** Este documento define as regras de domínio, limites de negócio e políticas da aplicação. Ele NÃO cobre detalhes técnicos de implementação, arquitetura de software intrínseca ou decisões exclusivas de infraestrutura.
- **Fonte das informações:** Decisões explicitadas pelo usuário e documentação de requisitos. (NÃO inferido do código-fonte).
- **Observação de soberania:** A API define as regras e limites de negócio. O Frontend atua apenas como consumidor (cliente) destas regras e estado. A validação real sempre ocorre no backend.

## 2. Glossário
*(Espaço reservado para termos específicos do domínio do negócio)*
- [PENDENTE]

## 3. Princípios Gerais de Negócio

Esta seção define os princípios fundamentais que regem o comportamento do sistema,
independente de camada técnica, tecnologia ou interface.

Esses princípios funcionam como as “leis” do sistema e devem ser respeitados por
API, integrações externas e frontend.

### 3.1. Fonte Única de Verdade

- Existe uma única fonte de verdade para os dados de negócio do sistema.
- O domínio central é soberano sobre o estado e a validade das informações.
- Nenhuma camada cliente ou integração externa pode assumir ou impor regras próprias.

---

### 3.2. Soberania do Backend

- As regras de negócio são definidas, validadas e aplicadas no backend.
- O frontend atua exclusivamente como consumidor e apresentador de estado.
- Integrações externas fornecem dados, mas não decidem regras.

---

### 3.3. Determinismo do Domínio

- Para uma mesma entrada de dados válida, o sistema deve produzir sempre o mesmo resultado.
- Regras de negócio não dependem de estado implícito, tempo não controlado ou comportamento aleatório.
- Decisões de negócio devem ser previsíveis e rastreáveis.

---

### 3.4. Proibição de Fluxos Paralelos de Negócio

- É proibido existir mais de um fluxo autorizado para executar a mesma regra de negócio.
- Toda operação crítica deve passar por um fluxo oficial previamente definido.
- Integrações externas não podem criar atalhos ou fluxos alternativos.

---

### 3.5. Idempotência como Princípio

- Operações de negócio devem ser idempotentes sempre que aplicável.
- A repetição de uma mesma intenção não pode gerar efeitos colaterais duplicados.
- O sistema deve proteger o domínio contra duplicidade lógica.

---

### 3.6. Tolerância a Falhas sem Violação de Regra

- Falhas técnicas não podem resultar em violação de regras de negócio.
- Em caso de erro, o sistema deve falhar de forma segura, previsível e controlada.
- A integridade do domínio tem prioridade sobre conveniência operacional.

---

### 3.7. Separação Clara entre Regra de Negócio e Implementação

- Regras de negócio descrevem o “o que” e o “porquê”, não o “como”.
- Detalhes técnicos, estruturas de dados e decisões de código não fazem parte do domínio.
- Alterações técnicas não devem alterar o significado das regras de negócio.

---

### 3.8. Evolução Controlada das Regras

- Regras de negócio não podem ser alteradas de forma implícita.
- Toda alteração exige versionamento explícito e registro histórico.
- O comportamento anterior deve ser sempre rastreável.


## 4. Regras de Negócio — API (SOBERANAS)

Esta seção define as regras de negócio que são **exclusivamente soberanas da API**.
Toda validação, decisão e garantia de integridade do domínio ocorre no backend.

Nenhuma outra camada pode substituir, duplicar ou contornar estas regras.

---

### 4.1. Criação de Entidades de Negócio

- A criação de entidades de negócio ocorre somente por fluxos autorizados.
- É proibido criar entidades de negócio fora dos fluxos oficiais definidos.
- Toda criação deve passar por validação completa das regras vigentes.
- A API é responsável por rejeitar entradas inválidas ou inconsistentes.

---

### 4.2. Validação e Integridade do Domínio

- A API deve garantir a integridade dos dados de negócio em qualquer cenário.
- Nenhuma informação inconsistente pode ser persistida.
- A ausência ou falha de dados externos não pode violar regras do domínio.
- A integridade do domínio tem prioridade sobre conveniência operacional.

---

### 4.3. Idempotência e Proteção contra Duplicidade

- Operações de criação devem ser idempotentes quando aplicável.
- A repetição de uma mesma intenção não pode gerar entidades duplicadas.
- A API deve identificar e bloquear duplicidades lógicas.
- Tentativas duplicadas devem resultar em comportamento previsível e seguro.

---

### 4.4. Controle de Origem das Operações

- Toda entidade de negócio possui uma origem claramente identificável.
- A origem define **como os dados chegam**, mas **não altera as regras aplicadas**.
- Nenhuma origem externa pode impor regras próprias ao domínio.
- A API é responsável por normalizar dados vindos de diferentes origens.

---

### 4.5. Fluxo Único e Oficial de Decisão

- Para cada decisão crítica de negócio, existe um único fluxo autorizado.
- É proibido manter fluxos paralelos que executem a mesma decisão.
- Alterações em fluxos oficiais exigem versionamento explícito das regras.

---

### 4.6. Tratamento de Erros de Negócio

- Erros de negócio devem ser tratados de forma explícita e previsível.
- A API não deve “seguir o fluxo” após uma violação de regra.
- Falhas devem resultar em rejeição controlada da operação.
- Erros técnicos não podem mascarar erros de negócio.

---

### 4.7. Persistência como Ato Final de Validação

- A persistência de dados ocorre somente após validação completa.
- A gravação em banco representa a aceitação final das regras de negócio.
- Nenhuma entidade inválida pode ser persistida sob nenhuma circunstância.

---

### 4.8. Independência da Camada Cliente

- A API não confia em validações realizadas por clientes.
- O frontend e integrações externas são tratados como fontes não confiáveis.
- Toda validação relevante é repetida e garantida no backend.

## 5. Regras de Integração Externa (API)

Esta seção define as regras de negócio aplicáveis à interação do sistema
com sistemas externos.

Integrações externas são tratadas exclusivamente como **fontes de dados**
e **gatilhos de eventos**, nunca como autoridades de regra de negócio.

---

### 5.1. Natureza das Integrações Externas

- Sistemas externos não possuem soberania sobre regras de negócio.
- Integrações não podem definir, alterar ou contornar regras do domínio.
- Toda informação externa é considerada não confiável até validação pela API.
- A API é responsável por interpretar, normalizar e validar dados externos.

---

### 5.2. Gatilhos de Eventos Externos

- Eventos vindos de sistemas externos podem iniciar fluxos de negócio.
- A ocorrência de um evento externo **não garante** a execução de uma ação de negócio.
- Todo evento externo está sujeito às regras vigentes do domínio.
- Eventos inválidos, incompletos ou fora de contexto devem ser ignorados de forma segura.

---

### 5.3. Criação de Entidades via Integração

- Integrações externas podem solicitar a criação de entidades de negócio.
- A criação somente ocorre se todas as regras soberanas da API forem atendidas.
- É proibido criar entidades de negócio diretamente a partir de dados externos
  sem validação completa.
- A origem externa deve ser registrada, mas não altera o comportamento da entidade.

---

### 5.4. Idempotência em Integrações

- Integrações externas devem ser tratadas como potencialmente repetitivas.
- A repetição de um mesmo evento externo não pode gerar efeitos duplicados.
- A API deve garantir que um mesmo evento lógico resulte em no máximo uma ação efetiva.
- A idempotência é obrigatória para fluxos iniciados por integração.

---

### 5.5. Falhas e Comportamento Seguro

- Falhas em integrações externas não podem comprometer o domínio.
- A indisponibilidade de sistemas externos não autoriza violação de regras de negócio.
- O sistema deve permanecer estável mesmo diante de eventos externos incorretos.
- Falhas externas não devem interromper o funcionamento do sistema principal.

---

### 5.6. Independência Evolutiva

- Alterações em sistemas externos não podem forçar mudanças imediatas no domínio.
- O domínio deve evoluir de forma controlada e versionada.
- Integrações devem se adaptar às regras do domínio, e não o contrário.

---

### 5.7. Observabilidade de Integrações

- Eventos relevantes de integração devem ser auditáveis.
- Decisões de aceitação ou rejeição de eventos externos devem ser rastreáveis.
- Logs devem registrar contexto suficiente para diagnóstico,
  sem expor dados sensíveis ou payloads completos.

## 6. Regras de Negócio — Frontend (DERIVADAS)

Esta seção define como o frontend deve **reagir, refletir e respeitar**
as regras de negócio soberanas definidas pela API.

O frontend NÃO define regras de negócio.
Ele atua exclusivamente como consumidor do domínio e do estado fornecido pela API.

---

### 6.1. Papel do Frontend no Domínio

- O frontend não é autoridade de regra de negócio.
- Nenhuma decisão crítica de negócio pode ser tomada no frontend.
- O frontend deve sempre refletir o estado retornado pela API como fonte de verdade.
- O frontend não pode criar, alterar ou contornar regras soberanas.

---

### 6.2. Consumo de Estado e Decisões

- O frontend deve consumir estados e decisões já processadas pela API.
- Estados inválidos ou não autorizados não devem ser simulados ou inferidos.
- O frontend não deve “corrigir” ou reinterpretar decisões do backend.
- Qualquer inconsistência deve ser tratada como erro ou bloqueio de ação.

---

### 6.3. Criação e Alteração de Dados

- O frontend pode solicitar ações de negócio apenas por meio de fluxos autorizados.
- O frontend não pode assumir que uma ação foi aceita antes da resposta da API.
- Toda alteração efetiva de dados depende de validação e confirmação do backend.
- O frontend não deve persistir estado de negócio como verdade definitiva.

---

### 6.4. Validações no Frontend

- Validações no frontend existem apenas para orientação do usuário.
- Nenhuma validação de frontend substitui validações soberanas da API.
- O frontend deve permitir que a API rejeite operações inválidas.
- Validações duplicadas não podem gerar comportamentos divergentes.

---

### 6.5. Integrações Visuais e Destaques

- O frontend pode destacar visualmente informações de origem ou estado.
- Destaques visuais não alteram comportamento funcional do domínio.
- A apresentação não pode criar significado de negócio inexistente.
- A semântica do domínio é sempre definida pela API.

---

### 6.6. Tratamento de Erros e Estados de Falha

- O frontend deve tratar erros retornados pela API de forma explícita.
- Falhas não devem ser ocultadas ou normalizadas visualmente.
- O frontend não deve seguir fluxos alternativos após erro de negócio.
- Estados de erro devem ser comunicados de forma clara ao usuário.

---

### 6.7. Independência de Implementação

- O frontend não deve depender de detalhes internos da implementação da API.
- Mudanças técnicas internas da API não devem exigir mudanças conceituais no frontend.
- O frontend deve se adaptar a regras versionadas e documentadas.

## 7. Regras de Estabilidade e Proibições

Esta seção define regras **intransigíveis** do sistema.
Elas existem para garantir a estabilidade, previsibilidade e integridade
do domínio de negócio, independentemente de mudanças técnicas ou operacionais.

Nenhuma conveniência técnica, integração externa ou decisão de interface
pode violar estas regras.

---

### 7.1. Proibição de Violação do Domínio

- É proibido violar regras de negócio vigentes sob qualquer circunstância.
- Falhas técnicas, erros de integração ou exceções operacionais
  não autorizam comportamentos fora do domínio.
- O sistema deve falhar de forma segura antes de violar uma regra de negócio.

---

### 7.2. Proibição de Duplicidade Lógica

- É proibido criar entidades de negócio duplicadas.
- A duplicidade lógica deve ser evitada mesmo em cenários de repetição de eventos.
- O sistema deve proteger o domínio contra efeitos colaterais repetidos.
- A idempotência é obrigatória para fluxos suscetíveis a reprocessamento.

---

### 7.3. Proibição de Fluxos Paralelos

- É proibido manter fluxos alternativos que executem a mesma regra de negócio.
- Toda decisão crítica deve ocorrer em um único fluxo oficial.
- Atalhos operacionais ou integrações diretas não são permitidos.

---

### 7.4. Proibição de Quebra de Contrato

- É proibido alterar comportamentos esperados do sistema sem versionamento explícito.
- Contratos de negócio não podem ser quebrados silenciosamente.
- Mudanças que afetem comportamento exigem atualização de regras e documentação.

---

### 7.5. Proibição de Contorno por Camada Cliente

- É proibido que frontend ou integrações externas contornem regras soberanas da API.
- Nenhuma camada cliente pode assumir estados ou decisões não confirmadas.
- Toda tentativa de contorno deve ser rejeitada pelo backend.

---

### 7.6. Proibição de Alterações Implícitas

- É proibido alterar regras de negócio de forma implícita ou indireta.
- Alterações de regra exigem:
  - Nova versão do documento de Regras de Negócio
  - Registro histórico
  - Alinhamento com o PROJECT_SUMMARY.md
- O comportamento anterior deve permanecer rastreável.

---

### 7.7. Prioridade da Estabilidade

- A estabilidade do sistema tem prioridade sobre novas funcionalidades.
- Em caso de conflito, preservar comportamento correto é obrigatório.
- Nenhuma entrega é válida se comprometer a estabilidade do domínio.

## 8. Observabilidade (Logs)

Esta seção define as regras de observabilidade do sistema,
com foco em rastreabilidade, diagnóstico e segurança em ambiente de produção.

Logs são um mecanismo de suporte à operação e auditoria do sistema,
e NÃO substituem regras de negócio, validações ou tratamento de erro.

---

### 8.1. Objetivo dos Logs

- Permitir diagnóstico de falhas e comportamentos inesperados.
- Tornar decisões relevantes do domínio auditáveis.
- Apoiar investigação de incidentes em produção.
- Garantir rastreabilidade de eventos críticos de negócio.

---

### 8.2. Princípio do Log Significativo

- Logs devem registrar apenas eventos relevantes.
- É proibido logar tudo indiscriminadamente.
- A ausência de logs críticos é tão prejudicial quanto o excesso de logs.
- Cada log deve possuir propósito claro de diagnóstico ou auditoria.

---

### 8.3. Eventos de Negócio que Devem ser Logados

- Início e término de fluxos críticos de negócio.
- Decisões relevantes tomadas pelo domínio.
- Aceitação ou rejeição de operações por regra de negócio.
- Tentativas bloqueadas por idempotência ou validação.
- Eventos relevantes de integração externa.
- Falhas que impactem o comportamento esperado do sistema.

---

### 8.4. Eventos que NÃO Devem ser Logados

- Dados sensíveis ou sigilosos.
- Payloads completos de requisição ou resposta.
- Informações irrelevantes para diagnóstico.
- Eventos de alta frequência sem significado de negócio.
- Logs redundantes em múltiplas camadas para o mesmo evento.

---

### 8.5. Logs e Tratamento de Erros

- Logs NÃO substituem tratamento de erro.
- É proibido apenas registrar erro e seguir o fluxo normalmente.
- Todo erro deve resultar em comportamento previsível e controlado.
- Um erro deve ser logado apenas uma vez, com contexto suficiente.

---

### 8.6. Relação entre Logs e Estabilidade

- Logs não podem mascarar falhas de negócio.
- Logs não autorizam violação de regras de estabilidade.
- Em caso de falha, a prioridade é preservar a integridade do domínio,
  não garantir continuidade artificial do fluxo.

---

### 8.7. Responsabilidade pela Observabilidade

- A API é responsável pelos logs de decisões soberanas do domínio.
- Integrações externas devem ter seus eventos relevantes rastreados.
- O frontend pode registrar eventos de uso, mas não decisões de negócio.
- A observabilidade deve permitir reconstruir o fluxo de eventos,
  sem depender de inferência a partir de código.

## 9. Pendências para Validação Humana

Esta seção lista pontos que **não podem ser definidos automaticamente**
sem risco de inferência indevida.

Nenhuma pendência aqui descrita deve ser resolvida por suposição,
implementação técnica ou interpretação de código.
Toda resolução exige validação explícita do responsável pelo domínio.

---

### 9.1. Glossário do Domínio

- Definição formal dos termos de negócio utilizados no sistema.
- Confirmação de nomenclaturas oficiais (ex.: OP, lote, status, origem).
- Validação de sinônimos aceitos e termos proibidos.

---

### 9.2. Estados e Ciclo de Vida das Entidades

- Lista completa dos estados possíveis das entidades de negócio.
- Regras de transição entre estados.
- Estados finais, intermediários e inválidos.
- Confirmação se existem estados de revisão manual ou exceção.

---

### 9.3. Regras Específicas de Integrações

- Confirmação das regras definitivas de parsing de dados externos.
- Definição de comportamentos esperados em caso de dados incompletos.
- Confirmação do que deve ser ignorado silenciosamente versus rejeitado.
- Validação de regras de idempotência específicas por integração.

---

### 9.4. Comportamentos do Frontend

- Ações permitidas ao usuário em cada estado retornado pela API.
- Restrições de edição, exclusão ou reprocessamento.
- Comportamentos esperados em cenários de erro ou inconsistência.
- Confirmação de quais ações são apenas visuais versus funcionais.

---

### 9.5. Proibições Absolutas

- Lista final de operações que nunca podem ocorrer.
- Ações proibidas mesmo em ambientes de teste ou manutenção.
- Confirmação de dados que nunca podem ser removidos ou sobrescritos.

---

### 9.6. Versionamento e Evolução das Regras

- Critérios objetivos para definir quando uma mudança é:
  - correção menor (v1.x.x)
  - mudança de comportamento (vX.0.0)
- Confirmação de compatibilidade retroativa obrigatória ou não.
- Política de descontinuação de regras antigas, se aplicável.

---

### 9.7. Observabilidade de Negócio

- Confirmação de quais eventos de negócio devem ser auditados.
- Definição do nível mínimo de rastreabilidade exigido.
- Validação de quais erros exigem alerta versus apenas registro.

---

## Estado Atual das Pendências

Todas as pendências acima encontram-se **em aberto** e aguardam
definição explícita do responsável pelo domínio de negócio.

Nenhuma decisão técnica deve ser tomada para resolver estas pendências
sem validação humana documentada.

## 9. PENDÊNCIAS PARA VALIDAÇÃO HUMANA
- Preencher os termos do domínio no Glossário.
- Definir e detalhar as regras da API.
- Definir e detalhar as regras de integrações.
- Mapear comportamentos esperados no Frontend baseados nos estados da API.
- Validar quais operações são absolutamente proibidas no sistema para a seção de Estabilidade.

## 10. Processo de Versionamento
- `README.md` sempre representa a versão **ATIVA** e vigente das regras.
- O diretório `versoes/` guarda cópias **IMUTÁVEIS** das versões anteriores.
- Toda alteração exige:
  1. Criação de um novo arquivo em `versoes/` (ex: `regras_negocio_v1.1.0.md`).
  2. Atualização completa do arquivo `README.md`.
  3. Registro do resumo de alterações no arquivo `changelog.md`.
- É estritamente **proibido** editar o conteúdo de versões antigas no diretório `versoes/`.
