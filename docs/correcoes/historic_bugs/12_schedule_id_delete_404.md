# Correção de Bug: Erro 404 ao Excluir Agendamento de Produção

## Descrição do Bug
Após aplicarmos o lançamento correto de erros 404 para registros não existentes no Prisma, o usuário demonstrou que passou a enfrentar o erro `[ScheduleRepository] Erro ao deletar agendamento: Request failed with status code 404` tentando excluir agendamentos pelo botão "Remover" na interface do modal de programação. O item permanecia fantasma na tela.

## Causa Raiz
No frontend (`RemoveProductionSchedule` e `MonitoringPage`), a exclusão do agendamento passava a *descrição* (`description`) como o identificador (`id`) para a API, devido ao acoplamento pelo uso focado apenas em nomes nas tabelas do front. Como as requisições mandavam a requisição HTTP tipo `DELETE /schedules/{DescricaoDoProduto}`, o Prisma procurava por um ID com esse texto exato, obviamente não encontrava por estar armazenado com um UUID (`uuidv4()`), e retornava nosso novo erro 404. Somado a isso o repositório consumia o erro silenciosamente escondendo o problema.

## Como foi corrigido
- Refatorado `SetProductionSchedule`: Ao invés de sempre injetar novos `uuidv4()` criando duplicações cegas, agora procuramos antes se o agendamento daquela descrição já existe e utilizamos o mesmo ID no Upsert.
- Refatorado `RemoveProductionSchedule`: Inserimos um passo prévio que localiza o ID real (`schedule.id`) varrendo os agendamentos já em memória (buscando pela descrição correspondente) para enviar corretamente o ID no payload dinâmico da rota `DELETE /schedules/:id`.
- Repositório `ScheduleRepository` passou a propagar (`throw`) os erros corretamente.

## Passos Realizados
- [x] PRONTA: Adequação no lookup de exclusão (`removeProductionSchedule`).
- [x] PRONTA: Prevenção de duplicatas de UUIDs nos Upserts locais do painel (`setProductionSchedule`).
- [x] PRONTA: Propagação de erro explícita no repositório.

## Como evitar no futuro
Sempre que o backend for atualizado para ser mais "strict" (estrito - como jogar e respeitar 404), certifique-se de validar se o frontend não estava se aproveitando da ausência de erros (silêncio) para passar payloads disfuncionais, como usar "nomes" como "IDs primários".
