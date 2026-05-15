# Comportamento de Execução do Sistema

## 1. Cabeçalho
- **Versão:** v1.0.0
- **Data:** 2026-05-13
- **Status:** ATIVO
- **Escopo do documento:** Este documento define limites, obrigações e proibições do comportamento do código no nível de execução. Ele não define regras de negócio, arquitetura ou estrutura de pastas.
- **Relação com Regras de Negócio:** Este documento garante as diretrizes de execução técnica para que o código respeite e implemente, não decida, as regras de negócio.

## 2. Princípios de Execução
- **Fluxo explícito de decisão:** O código DEVE explicitar claramente o fluxo de decisões. Nenhuma decisão pode ser baseada em "efeitos colaterais" ou lógicas obscuras.
- **Proibição de comportamento implícito:** O comportamento do código NÃO DEVE assumir estados não verificados nem inferir intenções do usuário ou de outras camadas. 
- **Determinismo do comportamento:** Dada a mesma entrada e o mesmo estado, a execução do código DEVE produzir o mesmo resultado esperado previsível.

## 3. Ordem de Validação
- **Validação de negócio antes de persistência:** Toda a lógica e validação do domínio DEVE ser executada com sucesso antes de qualquer estado ser persistido.
- **Validação técnica não substitui domínio:** A validação de tipos de dados, payloads e contratos API (validação técnica) é pré-requisito, mas NÃO DEVE tentar validar regras do domínio nem substituí-las.
- **Persistência como ato final de aceitação:** A comunicação com o banco de dados e a gravação do estado são o ato final de a operação ter sido aceita pelo domínio.

## 4. Tratamento de Erros
- **Erros de negócio x erros técnicos:** O código DEVE distinguir claramente erros gerados por falha em regra de domínio (e.g., saldo insuficiente) de erros puramente técnicos (e.g., timeout em banco).
- **Proibição de engolir erros:** O código É PROIBIDO de ignorar exceções (ex: blocos try-catch vazios, silenciar falhas) sem tratamento explícito e justificado.
- **Falha segura e previsível:** Se o sistema falhar, ele DEVE falhar interrompendo a operação imediatamente em um estado seguro, retornando o contexto do erro ao consumidor.

## 5. Persistência Segura
- **Proibição de persistência parcial:** É PROIBIDA a gravação de dados fracionados que quebrem a integridade lógica da entidade de negócio. A persistência DEVE ser de tudo ou nada.
- **Proibição de estados inválidos:** O sistema NÃO DEVE salvar no banco de dados nenhuma informação que represente um estado de negócio inválido.
- **Consistência acima de performance:** A garantia da integridade e consistência dos dados DEVE priorizar a execução, não podendo ser comprometida em nome de otimizações de performance.

## 6. Concorrência e Repetição
- **Idempotência de comportamento:** Repetições exatas da mesma chamada ao processamento NÃO DEVEM gerar efeitos colaterais duplicados ou inconsistentes.
- **Resiliência a chamadas repetidas:** O sistema DEVE ser capaz de identificar repetições e reagir de maneira segura alertando que a ação já foi cumprida ou abortando-a, sem quebrar.
- **Proibição de efeitos colaterais duplicados:** É PROIBIDO acionar integrações e ações secundárias mais vezes do que o fluxo determinístico prescreve frente a uma entrada.

## 7. Integrações Externas
- **Integrações não controlam fluxo interno:** O retorno de uma integração parceira provê os dados, mas NÃO DEVE ditar isoladamente o andamento do estado lógico da aplicação.
- **Eventos fora de ordem não violam domínio:** O código DEVE prever a recepção de eventos fora da ordem ou indesejados sem que isso leve a quebra da integridade das regras globais do domínio.
- **Falhas externas não quebram integridade:** A indisponibilidade total ou parcial de um serviço externo DEVE resultar na parada temporária e não em transições defeituosas ou vazamento de inconsistência.

## 8. Logs e Observabilidade
- **Logs como suporte, não controle:** Logs DEVEM ser utilizados exclusivamente para rastrear e diagnosticar o que o código faz, e NÃO como recurso técnico de onde a aplicação deva derivar comportamentos.
- **O que deve ser logado:** Entradas e saídas de fluxos críticos, chamadas a integrações externas, decisões de negócio relevantes, falhas de validação e erros.
- **O que é proibido logar:** É PROIBIDO logar eventos de polling de alta repetição sem mudança de estado significante, informações pessoais sensíveis, senhas, tokens e payloads de requisição e resposta completos.
- **Logs não substituem regra nem validação:** É PROIBIDO registrar um log e seguir a execução normalmente quando a indicação de estado incorreto requereria abortar as operações (logs não substituem tratamento de falhas).

## 9. Proibições de Implementação
- **Comportamentos explicitamente proibidos no código:** É PROIBIDO vazar dados não normalizados das bibliotecas/persistência para consumidores e é PROIBIDO criar acoplamentos desnecessários entres os módulos.
- **Atalhos técnicos:** É PROIBIDO o uso de variáveis ou estados globais no código para simular contexto sem passar pelas assinaturas e injeções puras de métodos e classes.
- **Dependência de convenções implícitas:** O fluxo de execução NÃO DEVE depender de dados não definidos estruturadamente por tipo ou contratos exatos.

## 10. PENDÊNCIAS PARA VALIDAÇÃO HUMANA
- [PENDENTE] Nomenclaturas exatas dos modelos de erros técnicos e de domínio a serem adotadas.
- [PENDENTE] Definição exata sobre em qual nível logar determinados tipos específicos de erros técnicos (uso de Warning vs Error num caso de Retry).
- [PENDENTE] Como as transações atomizadas de banco devem ser orquestradas nas camadas, em caso de persistências parciais exigidas.
- [PENDENTE] Formato ou esquema JSON do registro de rastreio dos logs globais do sistema.
