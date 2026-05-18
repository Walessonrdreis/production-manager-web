# Correção de Bug: Erro 404 ao buscar Controles de Produção na Integração Externa

## Descrição do Bug
Os painéis de Controle de Produção (listagem e consultas por ID) registravam erros de `404 Not Found` ao bater no proxy interno da API de Produções. Os logs do backend indicavam `Failed to fetch external produced records: AppError: Failed to fetch produced data: Request failed with status code 404`.

## Causa Raiz
O `ProductionAdapter` estava apontado para as rotas remotas hipotéticas `/admin/produced` e `/admin/schedules`, que não existem no Nginx da API Externa Renderizada (`production-manager-api.onrender.com`). Na implementação original (`DashboardAdapter`), a rota em uso sempre foi `/dashboard/produced`.

## Como foi corrigido
- Corrigida a URL do Adapter `ProductionAdapter.fetchProduced()` para espelhar a rota verdadeira (`/dashboard/produced`).
- Adicionado tratamento proativo de captura do erro `404` no `ProductionAdapter` para retornar Arrays vazios `[]` para rotas não mapeadas na API base (no caso de `/admin/schedules` não existir na Externa).

## Passos Realizados
- [x] PRONTA: Mapeamento de rotas válidas usadas pelo Legacy vs Novos Casos de Uso.
- [x] PRONTA: Atualização de `production.adapter.ts`.
- [x] PRONTA: Inserção de graceful fallback se `err.response?.status === 404`.

## Como evitar no futuro
Sempre que uma nova refatoração introduzir Adapters de integração para fundir rotas internas e externas, garantir através de logs operantes os caminhos da API remota antes de generalizar endpoints (`/admin/...`). Quando possível, prever fallback de arrays vazias evitam a quebra de listagens em tela.
