# Relatório de Análise: Violações Arquiteturais na Etapa 5 da Refatoração Backend

## Contexto e Objetivo
Durante a revisão dos arquivos extraídos na nova estrutura modular (Etapa 5 do plano de refatoração), foram identificadas diversas violações dos **Pilares Arquiteturais** definidos no `AGENTS.md`. Os controladores recém-criados (`ProductsController`, `OrdersController` e `ClientsController`) foram implementados provisoriamente provendo suas funções, transferindo a lógica que estava no Proxy, mas sem adequação profunda à arquitetura corporativa e camadas estabelecidas.

## Problemas Identificados

### 1. Acoplamento de Infraestrutura (Violação do DIP e Isolamento)
Os controladores estão fazendo chamadas diretas com a biblioteca `axios`.
- **Regra Desrespeitada**: O domínio (e o controlador HTTP) não deve conhecer detalhes de persistência ou APIs externas. As chamadas externas `axios` deveriam residir em `infrastructure/integrations/`.
- **Arquivos Afetados**: 
  - `apps/api/src/modules/products/presentation/http/controllers/ProductsController.ts`
  - `apps/api/src/modules/orders/presentation/http/controllers/OrdersController.ts`
  - `apps/api/src/modules/clients/presentation/http/controllers/ClientsController.ts`

### 2. Lógica de Negócio em Componentes Inadequados (Mapeamento no Controller)
O `OrdersController` possui lógica de redução (`reduce` do totalValue), cálculo e conversão de formato através do array (`map`).
- **Regra Desrespeitada**: "Nenhuma lógica de cálculo ou decisão deve estar em Controladores (Express)." Toda essa lógica deveria estar em um Use Case em `application/use-cases/` auxiliado por mapeadores explícitos (Mappers).

### 3. Falta de Tratamento de Erros e Padrão de Retorno
Os Controladores atuais usam blocos `try/catch` que empurram o erro engessado e não tipado como status 500 ao invés de delegar o problema ao wrapper natural da API.
- **Regra Desrespeitada**: O projeto possui o padrão de erro `AppError` e `response.ts` implementado na Etapa 3 e deve retornar respostas padronizadas baseadas no Result Pattern através das camadas. 

### 4. Ausência de TDD e Validação de Fronteira (Zod)
- **Testes Unitários ausentes**: Não foram criados testes acompanhando essas novas lógicas e mapeamentos (violação da regra TDD 100%).
- **Ausência de Zod**: Não há padronização via bibliotecas de fronteira (Zod) durante o request (`infra` ou `presentation`).

## Conclusão e Melhorias Propostas
Para estarmos alinhados aos 7 pilares do AGENTS.md (Item 4):
1. **Camada de Adaptação Externa (Infrastructure):** Extrair o construtor isolado do `axios` (API do Onrender) contido em cada controlador para Adapters em `infrastructure/integrations/`.
2. **Separação por Use Cases (Application):** Criar casos de uso (`SyncOrdersUseCase.ts`, etc.) que coordenam o tráfego de dados isolando o controller disso.
3. **Mappers & DTOs:** Remover a lógica de de/para de variáveis soltas do código do `OrdersController.ts` e abstraí-las para normalize objects.
4. **Padronização e Tratamento com Middleware:** Substituir status HTTP embutidos nos `controllers` pelas abordagens centrais em `/shared/http/response.ts` e erros mapeados ao Next() `AppError`.
5. **Cobertura Testável:** Escrever arquivos e testes garantindo os mocks de integração e o sucesso de retorno.

Aguardando decisão aprobatória para seguirmos com o ajuste nos arquivos apontados.
