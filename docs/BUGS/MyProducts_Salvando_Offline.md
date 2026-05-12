# MyProducts (Stocks) Salvando Offline (IndexDB) ao invés da API backend

**Problema Identificado**
A funcionalidade de "Produtos Salvos" / "My Products" (gerenciada em `apps/web/src/features/stocks`) está usando o Dexie (banco LocalForage/IndexedDB off-line) apontando para o `db.myProducts` para salvar e recuperar os produtos favoritos do usuário. Apesar da infraestrutura de backend para stocks já existir (`apps/api/src/modules/stocks`), o frontend nunca foi atualizado para consumi-la, causando um comportamento inconsistente (os produtos ficam presos apenas no navegador local e não são distribuídos com a aplicação principal de nuvem).

**Por que isso acontece?**
No arquivo `apps/web/src/features/stocks/infra/MyProductsRepository.ts`, todas as funções base (`getAll`, `save`, `delete`, `update`, `clear`) estão utilizando as chamadas de banco local ao invés de se comunicar usando o `apiClient`.

**Passo a Passo de Resolução (Plano de Ação):**
*Atenção às regras de Refatoração:* Toda alteração será feita sem quebrar a aplicação. Criaremos o que for necessário ao lado (ex: um novo repository `ApiMyProductsRepository.ts`) mantendo o sistema original funcionando. Só faremos a substituição (chaveamento) das importações no final de cada etapa e validaremos a aplicação. Etapas não devem ser longas. Para cada passo testado, incluiremos "ATUALIZAÇÃO ENTREGUE" no `AGENTS.md`.

1. **Atualizar Autenticação no BD Central:** Verificar se a rota `/stocks` no backend está lidando corretamente com o usuário, e garantindo os endpoints corretos, mantendo tudo compatível sem quebrar a base.
2. **Criar ApiMyProductsRepository (novo Frontend Repository):** Em vez de atualizar diretamente o antigo `MyProductsRepository.ts` (para não quebrar a aplicação enquanto desenvolve), criar `apps/web/src/features/stocks/infra/ApiMyProductsRepository.ts` integrado com `apiClient` e `ENDPOINTS.STOCKS`.
3. **Mapear as Operações CRUD via apiClient (no novo Repository):**
    - `getAll()` -> Fazer `apiClient.get(ENDPOINTS.STOCKS.BASE)` e retornar a lista.
    - `save(product)` -> Fazer `apiClient.post(ENDPOINTS.STOCKS.BASE, product)`.
    - `update(id, updates)` -> Fazer `apiClient.put(ENDPOINTS.STOCKS.BASE + '/' + id, updates)`.
    - `delete(id)` -> Fazer `apiClient.delete(ENDPOINTS.STOCKS.BASE + '/' + id)`.
4. **Alinhar o Firebase Backend (`StocksRepository.ts` / Módulo Stocks da API):** O `apps/api/src/modules/stocks/infrastructure/db/StocksRepository.ts` deve estar apto para receber essas chamadas e respeitar o isolamento por usuário.
5. **Virada de Chave (Swapping das Importações):** Após testar o novo repositório isoladamente, mudar as importações no proxy/caso de uso (`apps/web/src/features/stocks/index.ts` e `useStocks.ts`) de `MyProductsRepository` para `ApiMyProductsRepository`. Em seguida testar a aplicação.
6. **Limpeza e Ações Resilientes com Optimistic UI:** Ao confirmar o sucesso do Switch, limpar o código antigo. Garantir que erros de Network revertam o estado no utilitário de persistência para manter a experiência fluída.
7. **Validação e Registro Final:** Compilar a aplicação web, garantir que Network (F12) valide chamadas para Nuvem. Registrar ATUALIZAÇÃO ENTREGUE no `AGENTS.md` e gerar o histórico em `docs/impprementacoes/historic_imprementations`.

*Toda atualização concluída e testada terá seu respectivo ATUALIZAÇÃO ENTREGUE marcado em `AGENTS.md` e será apresentada no chat como **PRONTA!** no final de cada passo após a autorização.*

---

**Todas as etapas concluídas com sucesso. PRONTA!**
(Storage migrado e validado)
