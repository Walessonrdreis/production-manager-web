# AGENTS2.md
## Instruções Obrigatórias para Agentes de IA (ALINHADO À OP EXISTENTE + TRELLO)

Este documento define regras **obrigatórias e inegociáveis** para qualquer Agente de IA que atue neste repositório.

❗ Qualquer desvio dessas regras é considerado **erro grave de processo**.

---

## 0. Princípio Fundamental

- Se algo for incompatível com estas regras, **PARE e PERGUNTE**.
- Este projeto usa **documentação viva**.
- **Nunca assumir intenções**.
- **Criar antes de alterar** é regra absoluta.
- **Estabilidade > Automação**.

---

## 1. Documentação Viva (Obrigatória)

Arquivo fonte da verdade:
- `PROJECT_SUMMARY.md`

Sempre que houver mudança em:
- estrutura
- arquitetura
- regras de negócio
- integrações (ex: Trello)
- webhooks
- fluxo de OP

O agente **DEVE**:
1. Ler `PROJECT_SUMMARY.md`
2. Atualizar as seções impactadas
3. Incrementar versão:
   - `v1.x.x` → ajustes menores
   - `vX.0.0` → mudanças estruturais
4. Atualizar a data

Nenhuma entrega é válida sem isso.

---

## 2. Palavras‑Chave de Controle do Usuário (AÇÃO OBRIGATÓRIA)

### Perguntas terminadas com **`ok?`**
- ❌ PROIBIDO codar
- ✅ Responder apenas via chat

### Perguntas terminadas com **`verifique!`**
- Investigar
- Criar relatório em `docs/BUGS/`
- ❌ NÃO codar
- Aguardar decisão

---

## 3. Regra de Estabilidade Absoluta

❌ **NUNCA quebrar a aplicação**

- Endpoints consumidos de  
  `https://production-manager-api.onrender.com/v1`
  **NUNCA podem ser removidos**
- Podem ser salvos ou encapsulados
- ❌ Nunca removidos sem autorização

---

## 4. SRP + TDD (Obrigatório)

- 1 arquivo = 1 intenção
- Nome: `Verbo + Objeto`
- Cresceu → dividir
- TDD obrigatório
- Logs sempre verificados

---

## 5. Protocolo Obrigatório de Resposta do Agente

Toda resposta técnica deve conter:
1. Guia/ADR respeitado
2. Classificação:
   - (a) implementação funcional
   - (b) refatoração local
   - (c) refatoração estrutural (PROIBIDA)
3. Lista de arquivos afetados
4. Bloqueio de escopo (pedir autorização se extrapolar)

---

## 6. Pilares Arquiteturais

- Result Pattern
- Imutabilidade
- Contract‑First
- DIP
- Nenhuma regra em Controller/UI
- Mappers explícitos
- TDD obrigatório
- Documentação viva

---

## 7. REGRA CRÍTICA — ORDEM DE PRODUÇÃO (OP)

### 7.1 Fonte Única de Verdade

✅ **JÁ EXISTE geração de OP MANUAL no sistema**

➡️ **É PROIBIDO criar um novo fluxo de OP para o Trello**

✅ Existe **UM ÚNICO use‑case de criação de OP**  
✅ Manual e Trello **DEVEM usar o MESMO fluxo**

---

### 7.2 Regra de Integração do Trello

O Trello é **apenas uma nova ORIGEM de DADOS**, não um novo domínio.

Fluxo correto:

UI Manual ┐
├─> CreateProductionOrderUseCase (existente)
Trello ───┘


❌ Proibido:
- criar `CreateProductionOrderFromTrello`
- duplicar regras
- criar status diferente
- confirmar OP automaticamente

---

### 7.3 Board e Lista Oficiais

- Board: PRODUÇÃO
- Lista gatilho: **TEMPERADOS – BARRAS**
- `TRELLO_LISTA_PRODUCAO_ID=672a2824e7f42ce048d73ead`

Nenhuma outra lista pode gerar OP.

---

### 7.4 Regra de Gatilho (INQUEBRÁVEL)

Criar OP **UMA ÚNICA VEZ** quando o card **ENTRAR** na lista:

✅ createCard  
✅ copyCard  
✅ updateCard (movendo de outra lista)

🚫 NÃO criar OP quando:
- card é apenas editado
- card sai da lista
- OP já existe (idempotência)

---

### 7.5 Idempotência

- `trelloCardId` é chave única
- Duplicar OP = erro grave

---

### 7.6 Parsing do Nome do Card (MVP)

Formatos aceitos:
1. `nome - lote - 108 un`
2. `nome - codigo - lote - 108 un`
3. `codigo - lote - 108 un`

Regras:
- lote e quantidade obrigatórios
- nome opcional
- codigo opcional
- se não parsear → NÃO cria OP

---

### 7.7 Regra de Criação da OP (MVP)

Criar OP se existir:
✅ lote válido  
✅ quantidade válida  
✅ **codigo OU nome**

Mesmo sem identificar produto automaticamente.

---

### 7.8 Resolução de Produto (MVP)

- Se existir codigo → tentar resolver
- ❌ NÃO usar fuzzy no MVP
- Se não bater:
  - OP criada normalmente
  - status = DRAFT ou NEEDS_REVIEW
  - edição manual continua sendo o fluxo oficial

---

### 7.9 Atualização da OP

❌ OP **NÃO** é atualizada automaticamente por edição do card  
✅ Ajustes são sempre **manuais**, usando o fluxo já existente

---

## 8. Regra de Implementação (MUITO IMPORTANTE)

### 🔒 REGRA ABSOLUTA

> **Criar primeiro, NÃO alterar o antigo.**

Procedimento obrigatório:
1. Criar integração do Trello **chamando o use‑case de OP existente**
2. Não alterar comportamento da OP manual
3. Validar logs e funcionamento
4. **Somente depois**, com autorização explícita, refatorar

Se em qualquer momento for necessário alterar código antigo:
➡️ **PARAR E PEDIR AUTORIZAÇÃO**

---
## 9. Estrutura Oficial do Backend

```text
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
   ├─ config/
   ├─ contracts/
   ├─ infra/
   ├─ legacy/
   ├─ lib/
   ├─ shared/
   └─ modules/

## 10. Regra Final (INQUEBRÁVEL)

O Trello NÃO manda no domínio.
A OP manual é soberana.
Se houver dúvida, parar e perguntar.