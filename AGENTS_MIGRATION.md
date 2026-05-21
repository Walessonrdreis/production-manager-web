# 🚀 INICIAR MIGRAÇÃO — DOMÍNIO STOCK (FASE 1)

## ✅ Regulamentos aplicáveis
- Regra 8 — Estabilidade Absoluta
- Regra 12 — Refatoração Incremental
- AGENT_MIGRATION.md — Migração Controlada
- api2_consumption_contract.md — Contrato de Leitura

---

## 🎯 MISSÃO

Executar exclusivamente a FASE 1 da migração do domínio de Stock:

👉 Preparação da API 2 para consumo do banco da API 1  
👉 Implementação de leitura paralela (Shadow Read)  
👉 Nenhuma mudança funcional visível  

---

## 📌 OBJETIVOS OBRIGATÓRIOS

1. Conectar a API 2 ao banco da API 1 (sem alterar comportamento existente)
2. Criar suporte a DUAL DATABASE:
   - Banco novo (API 1)
   - Banco legado (API 2)
3. Implementar leitura comparativa (SHADOW READ) entre:
   - `ProductStock` (fonte oficial — API 1)
   - `Stock` legado (API 2)
4. Produzir logs de comparação para validação

---

## 🔒 RESTRIÇÕES ABSOLUTAS

❌ NÃO remover código existente  
❌ NÃO alterar comportamento atual de endpoints  
❌ NÃO alterar contrato de resposta (response shape)  
❌ NÃO alterar frontend  
❌ NÃO remover tabelas  
❌ NÃO rodar migrations no banco da API 1  
❌ NÃO escrever dados no banco novo  
❌ NÃO alterar fluxo de negócio  

---

## ✅ PERMITIDO

✔ Criar novo Prisma Client (dual client)  
✔ Adicionar código de leitura paralela  
✔ Criar logs de comparação  
✔ Adicionar serviços auxiliares (sem impacto externo)  

---

## 🧩 IMPLEMENTAÇÃO OBRIGATÓRIA

### 1. Criar DUAL PRISMA CLIENT

- Cliente principal → banco API 1
- Cliente legado → banco antigo API 2

Deve permitir leitura independente em ambos.

---

### 2. Implementar SHADOW READ

Para o domínio de STOCK:

- Ler dados de:
  - `ProductStock` (novo)
  - `Stock` (legado)

- Executar comparação de:

Campos mínimos obrigatórios:
- quantidade (stockQuantity)
- identificador do produto (omieCode / equivalente)
- volume de registros

---

### 3. Criar LOGS OBRIGATÓRIOS

Logs devem conter:

- quantidade de registros (novo vs antigo)
- diferenças detectadas
- inconsistências relevantes
- timestamp da execução

---

### ⚠️ REGRAS DOS LOGS

- NÃO logar payload completo
- NÃO logar dados sensíveis
- Logar apenas dados necessários para validação

---

## 📊 CRITÉRIOS DE SUCESSO

✅ API 2 funcionando sem alteração de comportamento  
✅ Dados sendo lidos dos dois bancos com sucesso  
✅ Logs de comparação disponíveis  
✅ Nenhuma quebra de endpoint  
✅ Nenhuma alteração visível para o usuário  

---

## 🚨 CRITÉRIOS DE FALHA

❌ Erro em endpoint existente  
❌ Diferença de contrato de resposta  
❌ Tentativa de escrita no banco novo  
❌ Remoção de código legado  
❌ Alteração no frontend  

---

## 🛑 CONDIÇÃO DE PARADA OBRIGATÓRIA

Após concluir:

- IMPLEMENTAÇÃO DO DUAL CLIENT ✅
- IMPLEMENTAÇÃO DO SHADOW READ ✅
- LOGS GERADOS ✅

👉 O agente DEVE PARAR

👉 NÃO deve iniciar:
- migração de leitura
- remoção de código
- refatoração adicional

---

## 📤 SAÍDA ESPERADA

O agente deve entregar:

1. Código do dual Prisma client
2. Implementação do service de leitura paralela
3. Exemplo de execução com logs
4. Confirmação explícita de que nenhuma regra foi violada

---

## 🧠 REGRA FINAL

> Esta fase NÃO altera o sistema  
> Apenas prepara e valida  

Qualquer tentativa de ir além desta fase é considerada VIOLAÇÃO.