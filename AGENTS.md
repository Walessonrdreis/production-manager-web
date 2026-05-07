# Instruções para Agentes de IA

Este projeto utiliza um arquivo de documentação viva chamado `PROJECT_SUMMARY.md`.

## 1 Regra de Auto-Atualização
Sempre que houver uma alteração na **estrutura de arquivos**, na **arquitetura técnica** ou na **lógica de negócio** (ex: novos endpoints no proxy, novas regras de dedução, novos hooks de persistência), você DEVE:

1.  Ler o conteúdo atual de `PROJECT_SUMMARY.md`.
2.  Atualizar as seções pertinentes com a nova lógica ou infraestrutura.
3.  Incrementar a versão no cabeçalho seguindo o padrão `v1.x.x` (correções menores) ou `vX.0.0` (mudanças estruturais grandes).
4.  Data da atualização deve ser a data atual da conversa.

Isso garante que o proprietário do projeto sempre tenha um guia atualizado para estudo e evolução do sistema.

## 2. Regra de Granularidade (SRP Global)
- **1 Arquivo = 1 Intenção:** Se um arquivo faz "Fetch e Normalização", deve ser dividido em dois.
- **Nomes Explícitos:** Use o padrão `Verbo + Objeto` (ex: `GetSectors.ts`, `NormalizeProduct.ts`).
- **Crescimento Orgânico:** Se um arquivo ultrapassar a responsabilidade única, fragmente-o imediatamente.
- **Sinal de Alerta:** Se o teste de um arquivo exige muitos mocks complexos, o arquivo está grande demais.

## 3. Padrão de Resposta do Agente (Protocolo Obrigatório)
Para toda e qualquer tarefa, o agente deve iniciar a resposta com:

1.  **Citação da ADR/Guia:** Indicar quais seções estão sendo respeitadas.
2.  **Classificação da Mudança:**
    -   (a) implementação funcional
    -   (b) refatoração local (permitida)
    -   (c) refatoração estrutural ampla (proibida sem autorização)
3.  **Lista de Arquivos:** Listar todos os arquivos que serão modificados.
4.  **Bloqueio de Escopo:** Se surgir a necessidade de alterar um arquivo fora da lista inicial, o agente deve **parar e pedir nova autorização**.

## 4. Pilares Arquiteturais (Escalabilidade e Segurança)
Para garantir a saúde do projeto frontend a longo prazo 7 pilares:

1.  1.**Padronização de Retorno (Result Pattern)**: Camadas de UseCase e Serviço devem retornar `{ success: boolean, data?: T, error?: string }`. Isso força o tratamento explícito de erros e falhas de negócio em todas as camadas.
2.  **Imutabilidade e Pureza de Domínio**: Funções em `domain/` devem ser puras. Proibido mutar objetos de entrada; sempre retorne novas instâncias para evitar efeitos colaterais imprevisíveis.
3.  **Validação de Fronteira (Contract-First)**: Toda entrada de dados (Request API ou Input UI) deve ser validada via Zod na entrada (`infra/` ou `presentation/`). O domínio nunca deve receber dados "sujos".
4.  **Desacoplamento de Infraestrutura (DIP)**: O domínio não deve conhecer detalhes de persistência ou APIs externas (SQLite, IndexedDB, Omie). Utilize Interfaces/Contratos para definir as dependências do domínio.
5.  **Isolamento de Lógica de Negócio**: Nenhuma lógica de cálculo ou decisão deve estar em Componentes (React) ou Controladores (Express). Tudo deve estar centralizado e testado no `domain/` ou `usecases/`.
6.  **Estratégia de Mapeamento (Mappers/Normalizers)**: Utilize mappers explícitos para converter dados entre camadas (Ex: `Persistence -> Domain` e `Domain -> API`). Evite o vazamento de estruturas externas para o núcleo do sistema.
7.  **Test-Driven Development (TDD)**: 100% dos arquivos em `domain/` e `usecases/` devem ter testes acompanhando, cobrindo casos de sucesso, erro e limites.
8.  **Documentação Viva e Rastreabilidade**: O `PROJECT_SUMMARY.md` é a fonte da verdade técnica. Nenhuma funcionalidade é "Done" sem que sua lógica e contratos estejam documentados proativamente.

## 5. Estrutura Monolito 

1. Usar Estrutura_Monolito.md  como padrão sempre


