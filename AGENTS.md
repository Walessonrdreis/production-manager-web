# Instruções para Agentes de IA
Siga rigorosamente se precisar fazer algo que seja imcompativel pergunte
Este projeto utiliza um arquivo de documentação viva chamado `PROJECT_SUMMARY.md`.
#AÇÂO OBRIGATORIA NUNCA ESQUEÇA:# Toda pergunta que eu fizer que terminar com ok? não é permitido codar é para responder via chat somente
#AÇÂO OBRIGATORIA NUNCA ESQUEÇA:#Toda pergunta que eu fizer que terminar com verifique! Busque o problema na plicação faz um relatorio crie ou edite um documento em em docs/BUGS com nome objetivo do problema e enel deve conter  a descrição do problema ,  toda atualização comcluida e testada será marcado como PRONTA! no final de cada passo  e apresente no chat sem codar, e agurde minha decisão.
#AÇÂO OBRIGATORIA NUNCA ESQUEÇA:#Toda tod acorreção realizada de um bug ou error deve ser registrada em docs/correcoes/historic_bugs criando um arquivo .md descrever como foi realizado a correção e como evitar.
#AÇÂO OBRIGATORIA NUNCA ESQUEÇA:#Toda toda implementação deve ser registrada em docs/impprementacoes/historic_imprementations criando um arquivo .md que tenha a descrição de como foi feito e melhorias.

## 1. Regra de Auto-Atualização
Sempre que houver uma alteração na estrutura de arquivos, na arquitetura técnica ou na lógica de negócio (ex: novos endpoints no proxy, novas regras de dedução, novos hooks de persistência), você DEVE:
Ler o conteúdo atual de `PROJECT_SUMMARY.md`.
Atualizar as seções pertinentes com a nova lógica ou infraestrutura.
Incrementar a versão no cabeçalho seguindo o padrão `v1.x.x` (correções menores) ou `vX.0.0` (mudanças estruturais grandes).
Data da atualização deve ser a data atual da conversa.
Isso garante que o proprietário do projeto sempre tenha um guia atualizado para estudo e evolução do sistema.
##2. Nunna quebrar a aplicação no final da implementação. Os dados que são consumidos de https://production-manager-api.onrender.com/v1 não devem ser 
removidos, qualquer endpoint, pode ser salvo no banco de dados mas nunca removidos da aplicação, sem confirmação

## 2. Regra de Granularidade (SRP Global) e TDD
1 Arquivo = 1 Intenção: Se um arquivo faz "Fetch e Normalização", deve ser dividido em dois.
Nomes Explícitos: Use o padrão `Verbo + Objeto` (ex: `GetSectors.ts`, `NormalizeProduct.ts`).
Crescimento Orgânico: Se um arquivo ultrapassar a responsabilidade única, fragmente-o imediatamente.
Sinal de Alerta: Se o teste de um arquivo exige muitos mocks complexos, o arquivo está grande demais.
Toda nova funcionalidade será feita com TDD sem quebrar a aplicação verificando sempre os logs e corrigindo os erros.

## 2.1. Padrão de UI para Listagens (Tables e Linhas)
Listagens de dados devem adotar por padrão o visual limpo implementado na listagem de **Metas** (`GoalsManagementPage.tsx` e afins):
- Linhas (tr): Utilizar `hover:bg-gray-50 transition-colors group` para feedback visual simples.
- Células (td): Padding folgado com `px-6 py-4`. 
- Empilhamento de dados: Para poupar colunas horizontais, empilhar informações primárias e secundárias na mesma célula, como `font-medium text-gray-900` e a descrição logo abaixo em `text-sm text-gray-500`.
- Ações: Centralizar os botões de ação à direita na linha que são revelados apenas no hover (`opacity-0 group-hover:opacity-100 transition-opacity`).

## 3. Padrão de Resposta do Agente (Protocolo Obrigatório)
Para toda e qualquer tarefa, o agente deve iniciar a resposta com:
Citação da ADR/Guia: Indicar quais seções estão sendo respeitadas.
Classificação da Mudança:
(a) implementação funcional
(b) refatoração local (permitida)
(c) refatoração estrutural ampla (proibida sem autorização)
Lista de Arquivos: Listar todos os arquivos que serão modificados.
Bloqueio de Escopo: Se surgir a necessidade de alterar um arquivo fora da lista inicial, o agente deve parar e pedir nova autorização.

## 4. Pilares Arquiteturais (Escalabilidade e Segurança)
Para garantir a saúde do projeto frontend a longo prazo 7 pilares:
1.Padronização de Retorno (Result Pattern): Camadas de UseCase e Serviço devem retornar `{ success: boolean, data?: T, error?: string }`. Isso força o tratamento explícito de erros e falhas de negócio em todas as camadas.
Imutabilidade e Pureza de Domínio: Funções em `domain/` devem ser puras. Proibido mutar objetos de entrada; sempre retorne novas instâncias para evitar efeitos colaterais imprevisíveis.
Validação de Fronteira (Contract-First): Toda entrada de dados (Request API ou Input UI) deve ser validada via Zod na entrada (`infra/` ou `presentation/`). O domínio nunca deve receber dados "sujos".
Desacoplamento de Infraestrutura (DIP): O domínio não deve conhecer detalhes de persistência ou APIs externas (SQLite, IndexedDB, Omie). Utilize Interfaces/Contratos para definir as dependências do domínio.
Isolamento de Lógica de Negócio: Nenhuma lógica de cálculo ou decisão deve estar em Componentes (React) ou Controladores (Express). Tudo deve estar centralizado e testado no `domain/` ou `usecases/`.
Estratégia de Mapeamento (Mappers/Normalizers): Utilize mappers explícitos para converter dados entre camadas (Ex: `Persistence -> Domain` e `Domain -> API`). Evite o vazamento de estruturas externas para o núcleo do sistema.
Test-Driven Development (TDD): 100% dos arquivos em `domain/` e `usecases/` devem ter testes acompanhando, cobrindo casos de sucesso, erro e limites.
Documentação Viva e Rastreabilidade: O `PROJECT_SUMMARY.md` é a fonte da verdade técnica. Nenhuma funcionalidade é "Done" sem que sua lógica e contratos estejam documentados proativamente.

## 5. Backend estrutura 
apps/api/
├─ dist/
├─ docs/
│  ├─ prompts/
│  ├─ templates/
│  │  └─ module/
│  │     ├─ application/
│  │     │  └─ use-cases/
│  │     ├─ infrastructure/
│  │     └─ presentation/
│  │        └─ http/
│  └─ typedoc/
├─ db/
│  ├─ migrations/
│  ├─ seeds/
│  └─ schema/
├─ scripts/
│  └─ metrics/
├─ tests/
└─ src/
├─ bootstrap/
│  ├─ plugins/
│  │  ├─ error-handler.ts
│  │  ├─ job-lock.ts
│  │  ├─ logger.ts
│  │  └─ database.ts
│  ├─ app.ts
│  ├─ routes.ts
│  └─ server.ts
│
├─ config/
│  ├─ .env
│  ├─ env.ts
│  └─ index.ts
│
├─ contracts/
│  └─ example.contract.ts
│
├─ infra/
│  └─ db.ts
│
├─ legacy/
│
├─ lib/
│  └─ http.ts
│
├─ shared/
│  ├─ errors/
│  │  ├─ AppError.ts
│  │  ├─ domain-errors.ts
│  │  └─ http-errors.ts
│  ├─ http/
│  │  ├─ response.ts
│  │  └─ validate.ts
│  ├─ integrations/
│  │  └─ external/
│  │     ├─ external.adapter.ts
│  │     ├─ external.client.ts
│  │     └─ external.utils.ts
│  ├─ logger/
│  │  ├─ index.ts
│  │  └─ logger.ts
│  └─ utils/
│     ├─ backoff.ts
│     └─ job-lock.ts
│
├─ modules/
│  ├─ name_module/
│  │  ├─ application/
│  │  │  ├─ dtos/
│  │  │  ├─ ports/
│  │  │  └─ use-cases/
│  │  ├─ infrastructure/
│  │  │  ├─ db/
│  │  │  ├─ integrations/
│  │  │  └─ jobs/
│  │  ├─ presentation/
│  │  │  └─ http/
│  │  │     ├─ controllers/
│  │  │     ├─ routes.ts
│  │  │     └─ schemas.ts
│  │  └─ index.ts
│  │
│  └─ name_module/
│     ├─ application/
│     ├─ infrastructure/
│     ├─ presentation/
│     └─ index.ts
│
└─ server.ts

## 6. Plano de Refatoração 
A fim de manter o controle arquitetural e presevar tudo funcioando.
- Toda e qualquer refatoração sej frontend ou backend deve ser implementada sem quebrar a aplicação, cria o que é necessario seguindo nossos padroes, mantendo o sistema funcionando depois só muda as importações
- Não deve ser longa, para evitar erros no processo, trabalhe focando em partes por parte

ATUALIZAÇÃO ENTREGUE: Refatoração de MyProducts finalizada (Storage migrado de Offline IndexDB para Nuvem via ApiMyProductsRepository respeitando o padrão Backend).
ATUALIZAÇÃO ENTREGUE: Integração Trello Webhook v4.15.2 com parsing de lote numérico e resolução via catálogo de produtos.

## 7. Planejamento e Passos para a Migração do Frontend para apps/web
Passo 1: Criação e Espelhamento Progressivo (Shadowing)
Criar o diretório /apps/web/.
Copiar (ao invés de mover) as pastas /src e /public e todos os arquivos de configuração do frontend (vite.config.ts, tailwind.config.js, tsconfig.json, index.html, etc.) para /apps/web/.
Porque é seguro: O sistema atual continuará operando 100% da raiz enquanto o clone é estruturado.
ATUALIZAÇÃO ENTREGUE

Passo 2: Configuração Isolada do Workspace (Ajuste de Caminhos)
Entrar no recém-criado /apps/web/ e ajustar estritamente dentro dele o vite.config.ts, tsconfig.json e eventuais arquivos específicos (ex: components.json).
Garantir que os aliases (como @/) apontem corretamente para /apps/web/src.
Porque é seguro: O Vite antigo na raiz permance inalterado.
ATUALIZAÇÃO ENTREGUE

Passo 3: Chaveamento Transparente do Express (API ↔ Vite)
Ajustar o apps/api/src/bootstrap/server.ts para direcionar o middleware do Vite (em dev) e a varredura (express.static) para o caminho path.join(process.cwd(), 'apps/web').
Porque é seguro: Se algo der errado na leitura, temos os logs exatos de onde o Express está tentando achar os arquivos, podendo ser rapidamente revertido para a raiz.
ATUALIZAÇÃO ENTREGUE

Passo 4: Virada de Chave (Swapping) nos Scripts no package.json
Atualizar os scripts no package.json da raiz:
O comando de build será algo como vite build --config apps/web/vite.config.ts (ou rodar um npm script local se adotarmos package.json próprio no workspace no futuro).
No Node, faremos o Vite trabalhar tendo /apps/web/ como pasta base de contexto.
Reiniciar o servidor e testar minuciosamente se o frontend responde, consome o HMR perfeitamente e os Endpoints do Express são chamados corretamente.
ATUALIZAÇÃO ENTREGUE

Passo 5: Clean-up (Limpeza) e Documentação (Ponto de Retorno Seguro)
Apenas após validarmos que o frontend sobe com sucesso puramente a partir de /apps/web/, nós faremos a remoção (delete) da pasta /src, /public e as de configs de UI que ficaram sobrando na raiz.
Atualizar os documentos vivos (PROJECT_SUMMARY.md e AGENTS.md) validando as entregas.
ATUALIZAÇÃO ENTREGUE


Todo Passo relizazada no final dela coloque ATUALIZAÇÂO ENTREGUE em AGENTS.md 7. Planejamento e Passos para a Migração do Frontend para apps/web, no final de cada Etapa.
