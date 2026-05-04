# Mapeamento de Funcionalidades e Armazenamento Local

Este documento lista todas as funcionalidades que utilizam ou deveriam utilizar armazenamento local (IndexedDB) como "cache" ou "buffer" antes de uma futura sincronização com API.

## 📋 Funcionalidades Identificadas

### 1. Planejamento (Planning)
- **Status Atual**: Lista simples no IndexedDB.
- **Evolução**: Precisa suportar "Lotes" (Batches) isolados.
- **Necessidade de API**: Endpoints para `POST /planning-batches` e `GET /planning-history`.

### 2. Metas (Goals)
- **Status Atual**: Planejado (ver `GOALS_SPECIFICATION.md`).
- **Campos Chave**: SKU (Código), Quantidade Alvo, Período.
- **Necessidade de API**: `GET/PUT /production-goals`.

### 3. Controle de Produção (Production Control)
- **Rastreabilidade Total**: Todas as ações dos operadores (marcar conclusão, desmarcar, alterar prazos, adicionar observações) devem ser salvas como eventos individuais (Event Sourcing) para auditoria e histórico.
- **Status Atual**: Salva estado final no `ProducedRepository` e agendamentos no `ScheduleRepository`.
- **Necessidade de API**: Endpoint de envio de logs/eventos de produção (`POST /production/events`).

### 4. Gestão de Setores (Sectors)
- **Status Atual**: CRUD local via `SectorsRepository`.
- **Relacionamento**: Lista de IDs de produtos do catálogo associados ao setor.
- **Necessidade de API**: Sincronização da estrutura organizacional da fábrica.

### 5. Catálogo Local (My Products)
- **Origem**: Omie API.
- **Persistência**: Uma cópia local dos produtos favoritados para evitar chamadas excessivas à Omie e permitir anexar dados extras (como pesos/metas).

---

## 🛠️ Diretrizes de Arquitetura

### 1. Descentralização de Dados
Para facilitar a manutenção e evitar que falhas em uma funcionalidade afetem outras, adotaremos a estratégia de **Persistência Isolada**:
- Cada funcionalidade (página/vaga) deve gerenciar seu próprio banco de dados ou stores específicos.
- Evitar centralizar tudo no `src/db/index.ts`. Cada feature deve ter seu próprio arquivo de infraestrutura (`infra/FeatureDB.ts`).

### 2. Estratégia de Troca Transparente (Plug-and-Play API)
Para garantir que a mudança para o banco de dados real seja apenas uma troca de configuração:
- **Interfaces**: Todo repositório deve ter uma `interface` definida.
- **Injeção de Dependência**: A aplicação deve usar o repositório através de hooks que decidem se chamam a versão `Local` ou `Remote` baseando-se em uma variável de ambiente ou configuração.
- Ao plugar a API, o código da UI permanece **inalterado**.

### 3. Critérios para Novo Banco de Dados Local
Sempre que criarmos um novo repositório local, ele deve obrigatoriamente incluir:
1. `synced: boolean` (Está na API?)
2. `lastModified: number` (Timestamp)
3. `productCode: string` (Link universal via SKU)
