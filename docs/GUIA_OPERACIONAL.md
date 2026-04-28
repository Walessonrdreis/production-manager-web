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
