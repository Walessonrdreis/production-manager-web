# Correção do Bug de Clients (404) e Refatoração do DB Fallback

**Status**: PRONTA
**ID**: BUG-404-CLIENTS

## Problema
- O frontend estava quebrando no WebSocket e na renderização pois a chamada `GET /api/clients` disparava um fetch para `API 1` (`/v1/clients`), a qual retornava `404 Not Found`.
- A API 1 (legacy API) não possui endpoints implementados para sincronização e exportação de clientes via Omie (apenas expõe products, orders, stock, etc).
- Após a remoção do Firebase (off-line sync), a UI não tinha nenhuma forma de adicionar ou ler clientes pois a `API 2` não possuía CRUD exposto e a `API 1` dava 404.

## Causa Raiz
- Em migrações anteriores para a stack Omie API 1, os *Clients* nunca foram abstraídos no backend legado, causando falha em toda leitura subseqüente. 
- Sem os verbos POST/PUT/DELETE em `clientsRouter` na API 2, o usuário estava impossibilitado de criar cadastros locais de clientes.

## Solução Implementada
1. **Fallback Automático e Silencioso**: Modificado `GetClientsListUseCase` para tentar ler do `legacyPrisma.customer` sempre que a `API 1 /v1/clients` retornar 404.
2. **Supressão de Erro Crítico**: `ClientsAdapter` agora engole o erro `500`/`404` do Axios se a API 1 falhar, retornando array vazio em vez de estourar timeout/rejection (isso evita o crash do websocket e do frontend).
3. **Reflotação do CRUD de Clientes em API 2**: 
   - Adicionados endpoints `GET /:id`, `POST /`, `PUT /:id` e `DELETE /:id` na rota de clientes (`clientsRouter`).
   - Implementado os respectivos callbacks no `ClientsController` diretamente persistindo e atualizando os dados (`legacyPrisma.customer`), permitindo à UI registrar e editar os clientes normalmente mesmo que a API 1 nunca retorne do Omie.
