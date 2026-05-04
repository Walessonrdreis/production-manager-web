# Plano de Evolução: Planejamento de Produção (v3.0)

Este documento detalha a reestruturação da funcionalidade de Planejamento, transformando-a de uma lista genérica em um sistema robusto de **Gestão de Lotes de Planejamento**.

## 🎯 Visão Geral
Atualmente, o planejamento é uma lista única que sincroniza com a produção. A evolução visa permitir que o usuário crie múltiplos "Lotes de Planejamento" (ex: Planejamento de Segunda, Lotes de Temperagem do Setor X), cada um com sua própria data, setor e registros, permitindo um histórico e melhor controle operacional.

---

## 🛠️ Mudanças Técnicas

### 1. Novo Modelo de Dados (`src/db/models.ts`)
Introduzir a entidade `PlanningBatch`, desenhada para compatibilidade com JSON/REST:
```typescript
interface PlanningItemDTO {
  productId: string;
  description: string;
  quantity: number;
  code?: string;
}

interface PlanningBatch {
  id: string;          // UUID (gerado no cliente p/ IndexedDB, ou vindo da API)
  date: string;        // Formato ISO YYYY-MM-DD
  sectorId: string;    // FK para Setores
  sectorName: string;  // Denormalizado para performance/histórico
  notes?: string;
  items: PlanningItemDTO[];
  status: 'draft' | 'confirmed' | 'produced';
  createdAt: string;   // ISO Timestamp
  updatedAt: string;   // ISO Timestamp
}
```

---

## 🛠️ Arquitetura de Repositório (Preparada para API)

Para garantir que o sistema não "quebre" quando mudarmos para um servidor real, usaremos o **Repository Pattern**:

### Camada 1: Interface (`src/features/planner/domain/IPlanningRepository.ts`)
Define o contrato. O código da UI não saberá se os dados vêm do navegador ou da nuvem.
```typescript
interface IPlanningRepository {
  getAll(): Promise<PlanningBatch[]>;
  getById(id: string): Promise<PlanningBatch | null>;
  save(batch: PlanningBatch): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Camada 2: Implementação Local (`src/features/planner/infra/PlanningIndexedDBRepo.ts`)
Implementação atual usando Dexie/IndexedDB. Possui campo `synced: boolean` para futura sincronização.

### Camada 3: Proxy de Mudança (Futuro)
Quando a API estiver pronta, basta criar `PlanningAPIRepo.ts` implementando a mesma Interface e mapear os endpoints REST.

### 2. Nova Interface de Gestão
Substituir a "Parede de Resumo" por um sistema de abas:
- **Aba "Lotes Ativos"**: Lista em cards/grid dos planejamentos criados, com status e datas.
- **Aba "Novo Planejamento"**: Interface limpa para selecionar produtos, definir quantidades e associar a um setor/data.

---

## 🎨 Design & UI (UX Intuitiva)

Seguindo a receita de **Dashboard Técnico (Recipe 1)**:
- **Grid Estruturado**: Uso de bordas visíveis para separar as colunas de dados.
- **Hierarquia Clara**: Títulos em Serif Itálico para humanizar, dados em Monospace para precisão.
- **CRUD Contextual**:
    - Botão de **Editar** abre o lote para modificação de quantidades.
    - Botão de **Excluir** com confirmação.
    - Status visual (badges) para saber o que já foi enviado para a produção.

---

## 📄 Sistema de PDF com Preview
Em vez do download direto, implementaremos um **Drawer** ou **Modal de Visualização**:
1. O usuário clica em "Gerar PDF".
2. Abre-se um modal com o componente `PDFViewer` (do `@react-pdf/renderer`).
3. O usuário revisa as informações.
4. Botão de "Confirmar e Baixar" dentro do preview.

---

## 🔄 Fluxo de Integração
- Ao salvar um Lote, o sistema pergunta se deseja "Sincronizar com Produção".
- Se confirmado, ele gera automaticamente os registros em `ProductionSchedule` para todos os itens do lote com a data definida.

---

## 🚀 Roteiro de Implementação (Timeline)

### Fase 1: Fundação (Dados e Repositórios)
- [ ] **Data Sync Prep**: Adicionar `synced: boolean` ao modelo local para marcar o que ainda não subiu para a nuvem.
- [ ] **Repository Identity**: Implementar o Repositório de Lotes seguindo a interface de abstração definida.
- [ ] **Migration Script**: Script para converter dados antigos (unificados) para o novo formato de lotes.
- [ ] Criar UseCases: `CreateBatch`, `UpdateBatch`, `DeleteBatch`, `ListBatches`.

### Fase 2: Interface de Listagem
- [ ] Criar `PlanningBatchList.tsx` para exibição dos lotes existentes.
- [ ] Implementar filtros por Setor e Data.

### Fase 3: Editor de Lotes
- [ ] Criar modal/tela de edição `PlanningBatchEditor.tsx`.
- [ ] Integrar seleção de produtos da Omie/Catálogo.

### Fase 4: Exportação e Preview
- [ ] Criar componente `PlanningPDFPreview.tsx`.
- [ ] Substituir o `PDFDownloadLink` direto pelo fluxo de visualização.

---

**Nota:** Este plano prioriza a autonomia do usuário para gerenciar diferentes momentos de produção sem perder o histórico do que foi planejado.
