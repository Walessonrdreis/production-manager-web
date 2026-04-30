# Guia Operacional: Governança e Manutenção (Pós-Migração)

Este guia deriva da **ADR-003** e serve como o protocolo padrão para qualquer alteração no código do Production Manager.

## 1. Checklist de Pré-Voo
Antes de escrever qualquer linha de código, responda mentalmente (ou no chat):
- [ ] Qual **feature** específica está sendo alterada?
- [ ] Isso mexe em **UI/UX**? (Se sim, garanta que a aparência final seja idêntica).
- [ ] Isso é uma **refatoração estrutural ampla**? (Se envolver mover pastas base ou múltiplas features: **PARE**).
- [ ] Qual é a **menor mudança possível** para atingir o objetivo?
- [ ] Quais **testes** unitários/integração vão cobrir este novo comportamento?

## 2. Pode / Não Pode

| Pode | Não Pode |
| :--- | :--- |
| Criar arquivos pequenos (SRP). | Mover diretórios base (`/app`, `/features`, etc). |
| Dividir arquivo grande dentro da mesma feature. | Reorganizar múltiplas features simultaneamente. |
| Criar subpastas em `usecases` ou `domain`. | Consolidar usecases em "Arquivos Mega/Genéricos". |
| Criar testes unitários para lógica de domínio. | Alterar contratos públicos (index.ts) por estética. |

## 3. Regra de Granularidade (SRP Global)
- **1 Arquivo = 1 Intenção:** Se um arquivo faz "Fetch e Normalização", deve ser dividido em dois.
- **Nomes Explícitos:** Use o padrão `Verbo + Objeto` (ex: `GetSectors.ts`, `NormalizeProduct.ts`).
- **Crescimento Orgânico:** Se um arquivo ultrapassar a responsabilidade única, fragmente-o imediatamente.
- **Sinal de Alerta:** Se o teste de um arquivo exige muitos mocks complexos, o arquivo está grande demais.

## 4. Política de Testes
- **Domain & Usecases:** Todo código novo nestas pastas **deve** ter um teste unitário correspondente.
- **Testes de UI:** Focados estritamente em comportamento visível e integração de features.
- **Performance:** Prefira testes baseados em lógica pura (vitest) que não dependem de renderização de browser para regras de negócio.

## 5. Padrão de Resposta do Agente (Protocolo Obrigatório)
Para toda e qualquer tarefa, o agente deve iniciar a resposta com:

1.  **Citação da ADR/Guia:** Indicar quais seções estão sendo respeitadas.
2.  **Classificação da Mudança:**
    -   (a) implementação funcional
    -   (b) refatoração local (permitida)
    -   (c) refatoração estrutural ampla (proibida sem autorização)
3.  **Lista de Arquivos:** Listar todos os arquivos que serão modificados.
4.  **Bloqueio de Escopo:** Se surgir a necessidade de alterar um arquivo fora da lista inicial, o agente deve **parar e pedir nova autorização**.

## 6. Pilares Arquiteturais (Escalabilidade e Segurança)
Para garantir a saúde do projeto a longo prazo, seguimos estes 7 pilares:

1.  **Padronização de Retorno (Result Pattern)**: UseCases devem retornar `{ success: boolean, data?: T, error?: string }`. Isso evita try/catch espalhado na UI e documenta falhas de negócio.
2.  **Imutabilidade no Domínio**: Funções em `domain/` devem ser puras. Proibido mutar objetos de entrada; sempre retorne novas instâncias.
3.  **Validação de Fronteira (Zod-First)**: Dados de APIs externas (Omie/Proxy) devem ser validados (via Zod ou similar) na camada de `infra/` antes da normalização.
4.  **Memoização Mandatória**: Filtros, buscas e cálculos pesados do domínio chamados em componentes de UI devem ser protegidos com `useMemo`.
5.  **Isolamento de Lógica**: Nenhuma lógica de cálculo ("como fazer") deve estar na UI ou em UseCases. Tudo deve estar centralizado e testado no `domain/`.
6.  **Estratégia de Normalização**: O mapeamento de API para o modelo interno deve ser isolado em arquivos `*Normalizer.ts` ou funções específicas no `domain/`.
7.  **Test-Driven Logic**: 100% dos arquivos na pasta `domain/` devem ter um arquivo `.test.ts` acompanhando, cobrindo casos de sucesso e erro.
8.  **Documentação Viva e Rastreabilidade (Living Documentation)**: O `PROJECT_SUMMARY.md` e o `GUIA_OPERACIONAL.md` são partes integrantes do sistema. Toda mudança de arquitetura, contrato ou lógica de negócio deve ser refletida na documentação proativamente pelo agente. Nenhuma funcionalidade é considerada "terminada" sem sua devida rastreabilidade documental.
