# Estratégia de Persistência de Dados e Transição para API

Este documento define como os dados são armazenados localmente e como a estrutura deve ser mantida para facilitar a migração para um backend (API REST) no futuro.

## 🎯 Objetivos
- **Offline-First**: O app deve funcionar plenamente sem internet usando IndexedDB.
- **API-Ready**: O formato dos dados salvos localmente deve ser idêntico ao esperado pela futura API.
- **Abstração Total**: A UI nunca deve saber de onde vêm os dados (Repositórios).

---

## 💾 Armazenamento Local (IndexedDB)

Utilizamos o **Dexie.js** para gerenciar o IndexedDB. Todas as entidades devem seguir o padrão de metadados de sincronização.

### Metadados Obrigatórios em cada Objeto:
```typescript
interface Syncable {
  id: string;          // UUID gerado localmente
  synced: boolean;     // false = alteração local pendente de subir para API
  lastModified: number; // Timestamp para resolução de conflitos
  version: number;     // Controle de concorrência otimista
}
```

---

## 🏗️ Implementação: Repositório de Catálogo (Meus Produtos)

Atualmente, os produtos salvos em "Meus Produtos" precisam estar disponíveis para serem associados a setores e planejamentos.

### 1. Entidade `CatalogProduct`
```typescript
interface CatalogProduct extends Syncable {
  code: string;         // SKU Omie
  description: string;
  unit: string;
  integratedAt: string; // Data que veio da Omie
  category?: string;
  sectorIds: string[];  // Relacionamento com setores (Muitos para Muitos)
}
```

### 2. Ciclo de Vida do Dado:
1. **Importação**: Ao favoritar um produto da Omie, ele é salvo no `CatalogRepository`.
2. **Associação**: Na tela de setores, o usuário pode "Puxar" produtos do Catálogo para dentro do setor.
3. **Persistência**: O ID do produto é guardado na lista do setor, mas os detalhes do produto permanecem no Catálogo (Fonte da Verdade).

---

## 🔄 Plano de Transição para API

Quando a API estiver pronta (ex: `https://api.factory-manager.com/v1`), seguiremos estes passos:

### Passo 1: Injeção de Dependência
No arquivo `index.ts` de cada feature, mudaremos a instância do repositório:
```typescript
// De:
const repo = new LocalProductRepository();
// Para:
const repo = new RemoteProductRepository(endpoint);
```

### Passo 2: Camada de Sincronização (Sync Engine)
Criaremos um worker que:
1. Varre o IndexedDB buscando registros com `synced: false`.
2. Faz o `POST` ou `PUT` para a API.
3. Se sucesso, marca `synced: true` e atualiza a `version` com o valor vindo do servidor.

---

## 📂 Entidades Mapeadas para Persistência Local

| Entidade | Status Atual | Localização Sugerida |
| :--- | :--- | :--- |
| **Sectors** | Parcial | `src/features/sectors/infra` |
| **Catalog** | Pendente | `src/features/catalog/infra` |
| **Planning** | Parcial | `src/features/planner/infra` |
| **Goals** | Planejado | `src/features/goals/infra` |

---

**Nota:** Esta estratégia garante que o desenvolvimento não pare por falta de backend, criando uma base sólida para um sistema corporativo de alto nível.
