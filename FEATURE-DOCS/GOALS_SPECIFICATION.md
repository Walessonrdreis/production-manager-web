# Especificação de Funcionalidade: Gestão de Metas de Produção (Goals)

Este documento detalha a implementação da funcionalidade de Metas, que servirá como balizador numérico para o sistema de Planejamento e Dashboards.

## 🎯 Objetivo
Permitir que a gestão defina metas de produção baseadas no **Código do Produto (SKU)**, garantindo que o planejamento tenha uma base numérica sólida por item. O sistema deve calcular o "Planejado vs. Meta" em tempo real, utilizando o Código para precisão e a Descrição para legibilidade humana.

---

## 🛠️ Mudanças Técnicas

### 1. Modelo de Dados (`src/features/goals/domain/Goal.ts`)
As metas serão vinculadas ao código único do produto para evitar erros com descrições similares:

```typescript
type GoalPeriod = 'daily' | 'weekly' | 'monthly';

interface ProductionGoal {
  id: string;            // UUID da meta
  productCode: string;   // SKU (Identificador mestre)
  productDescription: string; // Denormalizado para evitar lookups constantes
  targetQuantity: number;
  period: GoalPeriod;
  sectorId?: string;     // Meta por setor ou global
  isActive: boolean;
  updatedAt: string;
}
```

### 2. Repositório Abstrato (Estrutura p/ API)
```typescript
interface IGoalRepository {
  getGoalsByPeriod(period: GoalPeriod): Promise<ProductionGoal[]>;
  getGoalForProduct(productId: string, period: GoalPeriod): Promise<ProductionGoal | null>;
  upsertGoal(goal: Partial<ProductionGoal>): Promise<void>;
  deleteGoal(id: string): Promise<void>;
}
```

---

## 🔄 Integração com o Planejamento (V3.0)

A grande vantagem das metas aparece no **Editor de Lotes de Planejamento**:

1.  **Indicador Visual de Capacidade**: Ao adicionar um produto ao planejamento, o sistema exibe: 
    *   *Ex: "Planejado: 50 | Meta Diária: 100 (50% atingido)"*
2.  **Alertas de Under-Planning**: Avisar se o lote atual está muito abaixo da meta definida para o período.
3.  **Sugestão Automática**: Botão "Preencher até a Meta" (calcula a diferença entre o já planejado/produzido hoje e a meta definida).

---

## 🎨 Interface e Experiência do Usuário (Metas)

Utilizaremos o padrão **Configuração Técnica**:
- **Tela de Configuração de Metas**: Uma tabela simples onde o usuário seleciona o produto (do catálogo), define o período e a quantidade.
- **Gráficos de Progresso**: Mini-barras de progresso (progress bars) ao lado de cada item no planejamento.
- **Dashboard Executivo**: O Dashboard principal passará a exibir o "Velocity" da fábrica baseando-se nestas metas.

---

## 🚀 Roteiro de Implementação

### Fase 1: Fundação (Repositórios & Persistência)
- [ ] **Repository Abstraction**: Criar a interface `IGoalRepository` para isolar a lógica de armazenamento da UI.
- [ ] **IndexedDB Implementation**: Implementar `GoalIndexedDBRepo.ts` usando Dexie, adicionando o campo `synced: boolean` para futuras integrações em nuvem.
- [ ] **Sync Layer**: Preparar o modelo para aceitar `lastModified` e `version` vindos de uma API externa.
- [ ] **Core Hook**: Desenvolver o hook `useGoals` que encapsula o cálculo de "Meta vs Realizado".

### Fase 2: Gestão de Metas (CRUD)
- [ ] Interface de configuração de metas com busca por SKU ou Descrição.
- [ ] Validações: Impedir metas duplicadas para o mesmo SKU/Período.

### Fase 3: Inteligência no Planejamento
- [ ] **Goal-Aware Editor**: Injetar o comparador de metas nos itens do planejamento.
- [ ] Visualização de progresso ("Faltam X para bater a meta").

---

**Conclusão:** As Metas fornecem o "Norte" necessário para que o Planejamento seja estratégico e não apenas reativo.
