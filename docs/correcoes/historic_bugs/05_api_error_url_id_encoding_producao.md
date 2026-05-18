# Correção de Bug: Erro de API (400 Bad Request) ao interagir com Produção via ID

## Descrição do Bug
Ao tentar reverter ou acessar um item marcado como produzido cujo ID contivesse espaços, hífens ou caracteres especiais (ex: `pedido-9542615497-70% Cacau - Intenso 30g`), a aplicação retornava um erro `400 Bad Request`.

## Causa Raiz
O erro era provocado pois o ID não estava sendo devidamente codificado (`URL-encoded`) na montagem da URL da requisição feita pelo Axios em direção ao backend (`apiClient.get`, `apiClient.delete`, `apiClient.put`). Isso fazia com que o Nginx do servidor de hospedagem rejeitasse a solicitação antes mesmo de chegar ao Express.

## Como foi corrigido
Foi adicionada a função global `encodeURIComponent(id)` em cada montagem de URL nos repositórios front-end. O Express/Node.js decodifica nativamente o parâmetro na chegada.

## Passos Realizados
- [x] PRONTA: Mapeamento dos endpoints com problema no `ProducedRepository`.
- [x] PRONTA: Adição de `encodeURIComponent(id)` aos métodos `getById`, `markAsSynced`, e `delete` do `ProducedRepository`.
- [x] PRONTA: Adição de `encodeURIComponent(id)` ao método `delete` do `ScheduleRepository`.
- [x] PRONTA: Verificação do decodificador nativo no Controller (`req.params.id`).

## Como evitar no futuro
Sempre que uma variável de URL (Path Parameter) não for um identificador numérico estrito ou um UUID padrão (UUID v4 não costuma ter problema pois contém apenas hífens e alfanuméricos minúsculos), garantir que sua interpolação em requests HTTP inclua `encodeURIComponent`.
