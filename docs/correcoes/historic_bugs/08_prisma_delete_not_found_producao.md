# Correção de Bug: Erro 500 no Delete de Controle de Produção (Prisma)

## Descrição do Bug
Quando um usuário tentava deletar um agendamento ou produção que não estava registrado no banco de dados local do Prisma (ou seja, originado apenas da API Externa Renderizada e listado via hibridização), a API interna retornava `500 Internal Server Error`, impedindo a continuidade do processo na interface.

Os logs revelavam `PrismaClientKnownRequestError: Invalid prisma.productionSchedule.delete() invocation... Record to delete does not exist.`

## Causa Raiz
O caso de uso `DeleteScheduleUseCase` e `DeleteProducedUseCase` disparava cegamente `prisma.productionSchedule.delete({ where: { id } })`, cujos métodos no Prisma nativamente lançam o erro `P2025` quando não encontram a linha especificada no banco local. Como não havia bloco `try-catch`, a exceção derramava no Express e quebrava a request.

## Como foi corrigido
- Foi inserido tratamento de exceções (try/catch) nos métodos `deleteProducedRecord` e `deleteSchedule` em `PrismaProductionRepository.ts`.
- Capturamos explicitamente o erro `error.code === 'P2025'` e ignoramos silenciosamente a instrução, permitindo que a aplicação responda "Success" para o frontend. Desta forma o cliente prossegue em sua intenção (limpar um dado de tela) e encerramos a propagação da falha.

## Passos Realizados
- [x] PRONTA: Adicionado Try-Catch em `deleteProducedRecord` ignorando `P2025`.
- [x] PRONTA: Adicionado Try-Catch em `deleteSchedule` ignorando `P2025`.
- [x] PRONTA: Validação da compilação.

## Como evitar no futuro
Sempre que trabalharmos com exclusões via Prisma relacionadas a domínios de listagem híbrida (onde um item pode ter vindo puramente de API Externa sem ter sido copiado pro Prisma antes), deve-se ignorar o erro de "Not Found" no banco local no ato de deletar, afinal a intenção de ausência de registro já entra virtualmente em compliance.
